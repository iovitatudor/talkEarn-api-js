import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GlobalData } from '../auth/guards/global-data';
import { Order } from './models/orders.model';
import { Expert } from '../experts/models/experts.model';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import { v4 as uuidv4 } from 'uuid';
import { ExpertTranslation } from '../experts/models/experts-translations.model';
import { User } from '../users/models/user.model';
import { Appointment } from '../schedule/models/appointments.model';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order) private orderRepository: typeof Order) {}

  public async getAll(): Promise<Order[]> {
    return await this.orderRepository.findAll({
      order: [['id', 'DESC']],
      where: { project_id: AuthGuard.projectId },
      include: [
        {
          model: Expert,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
  }

  public async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: [
        {
          model: Expert,
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
        {
          model: User,
        },
        {
          model: Appointment,
        },
      ],
    });
    if (!order) {
      throw new HttpException('Order was not found.', HttpStatus.BAD_REQUEST);
    }
    return order;
  }

  public async findByToken(token: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      rejectOnEmpty: undefined,
      where: { token, project_id: AuthGuard.projectId },
      include: [
        {
          model: Expert,
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
        {
          model: User,
        },
        {
          model: Appointment,
        },
      ],
    });
    if (!order) {
      throw new HttpException('Order was not found.', HttpStatus.BAD_REQUEST);
    }
    return order;
  }

  public async store(orderDto: OrderCreateDto): Promise<Order> {
    const token = uuidv4();
    const order = await this.orderRepository.create({
      token,
      ...orderDto,
      project_id: Number(AuthGuard.projectId),
    });

    return await this.findById(order.id);
  }

  public async update(id: number, orderDto: OrderUpdateDto): Promise<Order> {
    await this.orderRepository.update(orderDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });

    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    return await this.orderRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }
}
