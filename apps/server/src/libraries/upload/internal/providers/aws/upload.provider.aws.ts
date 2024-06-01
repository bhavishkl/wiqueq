import {
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigurationService } from '@server/core/configuration'
import {
  FromPrivateToPublicUrlOptions,
  UploadPrivateOptions,
  UploadPrivateReturn,
  UploadProvider,
  UploadPublicOptions,
  UploadPublicReturn,
} from '@server/libraries/upload/upload.provider'
import { Logger, LoggerService } from '../../../../logger'

const ONE_HOUR_IN_SECONDS = 60 * 60

type Bucket = {
  name: string
  dateCreation: Date
}

@Injectable()
export class UploadProviderAws extends UploadProvider {
  private logger: Logger
  private client: S3Client
  private bucketPublicName: string
  private bucketPrivateName: string
  private region: string

  constructor(
    private loggerService: LoggerService,
    private configurationService: ConfigurationService,
  ) {
    super()

    this.logger = this.loggerService.create({ name: 'UploadProviderAws' })
  }

  public async initialise() {
    try {
      const accessKey = this.configurationService.get(
        `SERVER_UPLOAD_AWS_ACCESS_KEY`,
      )
      const secretKey = this.configurationService.get(
        `SERVER_UPLOAD_AWS_SECRET_KEY`,
      )

      if (!accessKey && !secretKey) {
        throw new Error(
          'Set SERVER_UPLOAD_AWS_ACCESS_KEY && SERVER_UPLOAD_AWS_SECRET_KEY in your .env to activate',
        )
      }

      if (!accessKey) {
        throw new Error(
          'Set SERVER_UPLOAD_AWS_ACCESS_KEY in your .env to activate',
        )
      }

      if (!secretKey) {
        throw new Error(
          'Set SERVER_UPLOAD_AWS_SECRET_KEY in your .env to activate',
        )
      }

      this.region = this.configurationService.get(
        `SERVER_UPLOAD_AWS_REGION`,
        'us-east-1',
      )

      this.bucketPublicName = this.configurationService.get(
        `SERVER_UPLOAD_AWS_BUCKET_PUBLIC_NAME`,
      )

      if (!this.bucketPublicName) {
        this.logger.warning(
          `Set SERVER_UPLOAD_AWS_BUCKET_PUBLIC_NAME in your .env to activate a public bucket with infinite urls`,
        )
      }

      this.bucketPrivateName = this.configurationService.get(
        `SERVER_UPLOAD_AWS_BUCKET_PRIVATE_NAME`,
      )

      if (!this.bucketPrivateName) {
        this.logger.warning(
          `Set SERVER_UPLOAD_AWS_BUCKET_PRIVATE_NAME in your .env to activate a private bucket with signed urls`,
        )
      }

      this.client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      })

      await this.check()

      this.logger.success(`AWS library active in region ${this.region}`)
    } catch (error) {
      this.logger.warning(`AWS library failed to start`)
      throw new Error(error)
    }
  }

  private async check(): Promise<void> {
    const buckets = await this.listBuckets()

    if (this.bucketPrivateName) {
      this.logger.log(`Checking bucket "${this.bucketPrivateName}"...`)

      const bucket = buckets.find(
        bucket => bucket.name === this.bucketPrivateName,
      )

      if (bucket) {
        this.logger.success(`Bucket "${this.bucketPrivateName}" is active`)
      } else {
        throw new Error(`Bucket "${this.bucketPrivateName}" was not found`)
      }
    }

    if (this.bucketPublicName) {
      this.logger.log(`Checking bucket "${this.bucketPublicName}"...`)

      const bucket = buckets.find(
        bucket => bucket.name === this.bucketPublicName,
      )

      if (bucket) {
        this.logger.success(`Bucket "${this.bucketPublicName}" is active`)
      } else {
        throw new Error(`Bucket "${this.bucketPublicName}" was not found`)
      }
    }
  }

  public async uploadPublic(
    options: UploadPublicOptions,
  ): Promise<UploadPublicReturn> {
    const { file } = options

    const key = this.ensureFilename(file.originalname)

    const command = new PutObjectCommand({
      Bucket: `${this.bucketPublicName}`,
      Key: this.ensureKey(key),
      Body: file.buffer,
      ContentType: file.mimetype ?? 'image/png',
    })

    try {
      await this.client.send(command)

      this.logger.success(`File ${file.originalname} saved (public)`)

      const url = `${this.getBaseUrlPublic()}/${key}`

      return { url }
    } catch (error) {
      this.logger.error(`${error}`)
      throw new Error(`Could not upload public file with key "${key}"`)
    }
  }

  public async uploadPrivate(
    options: UploadPrivateOptions,
  ): Promise<UploadPrivateReturn> {
    const { file } = options

    const key = this.ensureFilename(file.originalname)

    const command = new PutObjectCommand({
      Bucket: `${this.bucketPrivateName}`,
      Key: this.ensureKey(key),
      Body: file.buffer,
      ContentType: file.mimetype ?? 'image/png',
    })

    try {
      await this.client.send(command)

      this.logger.success(`File ${file.originalname} saved (private)`)

      const url = `${this.getBaseUrlPrivate()}/${key}`

      return { url }
    } catch (error) {
      this.logger.error(`${error}`)
      throw new Error(`Could not upload private file with key "${key}"`)
    }
  }

  async fromPrivateToPublicUrl({
    url,
    expiresInSeconds = ONE_HOUR_IN_SECONDS,
  }: FromPrivateToPublicUrlOptions): Promise<UploadPrivateReturn> {
    if (!this.isUrlPrivate(url)) {
      throw new Error(`${url} must be a private url`)
    }

    const key = this.extractKeyFromUrlPrivate(url)

    const params = {
      Bucket: `${this.bucketPrivateName}`,
      Key: this.ensureKey(key),
    }

    const command = new GetObjectCommand(params)

    const urlPublic = await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    })

    return { url: urlPublic }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   PRIVATE                                  */
  /* -------------------------------------------------------------------------- */

  private async listBuckets(): Promise<Bucket[]> {
    const result = await this.client.send(new ListBucketsCommand({}))

    const buckets = result.Buckets.map(item => ({
      name: item.Name,
      dateCreation: item.CreationDate,
    }))

    return buckets
  }

  private getBaseUrlPrivate(): string {
    return `https://${this.bucketPrivateName}.s3.${this.region}.amazonaws.com`
  }

  private getBaseUrlPublic(): string {
    return `https://${this.bucketPublicName}.s3.${this.region}.amazonaws.com`
  }

  private ensureKey(key: string): string {
    const isPrefixed = key.startsWith('/')

    if (isPrefixed) {
      return key.slice(1)
    }

    return key
  }

  private isUrlPrivate(url: string): boolean {
    const baseUrlPrivate = this.getBaseUrlPrivate()

    const isPrivate = url.startsWith(baseUrlPrivate)

    return isPrivate
  }

  private extractKeyFromUrlPrivate(url: string): string {
    const baseUrlPrivate = this.getBaseUrlPrivate()

    return url.replace(baseUrlPrivate, '')
  }
}
