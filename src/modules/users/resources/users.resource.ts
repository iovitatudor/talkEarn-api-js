import { Model } from 'sequelize';
import { ExpertsResource } from '../../experts/resources/experts.resource';

export class UsersResource {
  public id: number;
  public expertId: number;
  public cookie: string;
  public name: string;
  public email: string;
  public phone: string;
  public available: boolean;
  public avatar: string;
  public duration: string;
  public path: string;
  public expert: object;
  public lastEntry: string;
  public createdAt: string;
  public updatedAt: string;

  public constructor(user) {
    const createdDate = new Date(user.created_at);
    const updatedDate = new Date(user.updated_at);
    const lastEntry = new Date(user.last_entry);

    this.id = user.id;
    this.expertId = user.expert_id;
    this.cookie = user.cookie;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.available = user.available;
    this.avatar = user.avatar ? process.env.BASE_URL + user.avatar: null;
    this.duration = user.duration;
    this.path = user.path;
    this.lastEntry = user.last_entry;
    this.createdAt = createdDate.toDateString();
    this.updatedAt = updatedDate.toDateString();
  }

  public static collect(model: Model[], meta: Record<any, any>) {
    if (model) {
      const data = {};
      data['data'] = model.map((item) => {
        return new UsersResource(item);
      });
      if (meta) {
        data['meta'] = meta;
      }
      return data;
    }
  }
}
