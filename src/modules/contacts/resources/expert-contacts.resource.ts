import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';

@Injectable()
export class ExpertContactsResource {
  public id: number;
  public contactId: number;
  public name: string;
  public value: string;
  public icon: string;

  public constructor(contactValue) {
    this.id = contactValue.id;
    this.contactId = contactValue.contact.id;
    this.name = contactValue.contact.name;
    this.value = contactValue.link;
    this.icon = contactValue.contact.icon;
  }

  public static collect(model: Model[]): ExpertContactsResource[] {
    return model.map((item) => {
      return new ExpertContactsResource(item);
    });
  }
}
