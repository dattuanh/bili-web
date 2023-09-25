import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity({ name: 'contact' })
export class Contact extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_name', length: 30 })
    name: string;

    @Column({ name: 'phone_number', length: 12 })
    phoneNumber: string;

    @Column({ length: 255 })
    email: string;

    @Column()
    company: string;

    @Column()
    message: string;
}
