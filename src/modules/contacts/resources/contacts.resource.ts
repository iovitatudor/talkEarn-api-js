import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';

@Injectable()
export class ContactsResource {
  public id: number;
  public name: string;
  public icon: string;

  public constructor(contact) {
    this.id = contact.id;
    this.name = contact?.name;
    this.icon = contact?.icon;
  }

  public static collect(model: Model[]): ContactsResource[] {
    return model.map((item) => {
      return new ContactsResource(item);
    });
  }
}
