import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
  // static toDomain(raw: PrismaStudent): Student {
  //   return Student.create(
  //     {
  //       name: raw.name,
  //       email: raw.email,
  //       password: raw.password,
  //     },
  //     new UniqueEntityID(raw.id),
  //   )
  // }

  static toPersistence(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
