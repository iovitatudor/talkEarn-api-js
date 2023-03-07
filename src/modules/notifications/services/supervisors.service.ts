import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupervisorNotifications } from '../models/supervisor-notifications.model';
import { SupervisorNotificationCreateDto } from '../dto/supervisor-notification-create.dto';
import { SupervisorNotificationUpdateDto } from '../dto/supervisor-notification-update.dto';
import { NotificationStatusesEnum } from '../enums/notification-statuses.enum';
import { Expert } from '../../experts/models/experts.model';
import { ExpertTranslation } from '../../experts/models/experts-translations.model';
import { GlobalData } from '../../auth/guards/global-data';

@Injectable()
export class SupervisorsService {
  constructor(
    @InjectModel(SupervisorNotifications)
    private supervisorNotificationRepository: typeof SupervisorNotifications,
    @InjectModel(Expert) private expertRepository: typeof Expert,
  ) {}

  public async getAllByExpertId(
    expertId,
    status,
  ): Promise<SupervisorNotifications[]> {
    const where = { requested_id: expertId };
    if (status) {
      where['status'] = NotificationStatusesEnum[status];
    }
    return await this.supervisorNotificationRepository.findAll({
      order: [['id', 'DESC']],
      where: { ...where },
      include: [
        {
          model: Expert,
          as: 'supervisor',
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
      ],
    });
  }

  public async findById(id: number): Promise<SupervisorNotifications> {
    const notification = await this.supervisorNotificationRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
      include: [
        {
          model: Expert,
          as: 'supervisor',
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
      ],
    });
    if (!notification) {
      throw new HttpException(
        'Notification was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return notification;
  }

  public async store(
    notificationDto: SupervisorNotificationCreateDto,
  ): Promise<SupervisorNotifications> {
    const notification = await this.supervisorNotificationRepository.create({
      supervisor_id: notificationDto.supervisorId,
      supervisee_id: notificationDto.superviseeId,
      requested_id: notificationDto.requestedId,
      status: NotificationStatusesEnum[notificationDto.status],
      message: notificationDto.message,
    });

    return await this.findById(notification.id);
  }

  public async update(
    id: number,
    notificationDto: SupervisorNotificationUpdateDto,
  ): Promise<SupervisorNotifications> {
    await this.supervisorNotificationRepository.update(notificationDto, {
      returning: undefined,
      where: { id },
    });

    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    return await this.supervisorNotificationRepository.destroy({
      where: { id },
    });
  }

  public async allowSupervisorRequest(notificationId: number) {
    const notification = await this.findById(notificationId);

    await this.expertRepository.update(
      { supervisor_id: notification.supervisor_id },
      {
        returning: undefined,
        where: { id: notification.supervisee_id },
      },
    );

    return await this.destroy(notificationId);
  }
}
