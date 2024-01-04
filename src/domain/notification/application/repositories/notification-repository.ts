import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  findByID(id: string): Promise<Notification | null>
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
}
