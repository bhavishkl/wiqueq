import { Module } from '@nestjs/common'
import { UploadProviderLocal } from './internal/providers/local/upload.provider.local'
import { UploadService } from './upload.service'

@Module({
  imports: [UploadProviderLocal.setup()],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
