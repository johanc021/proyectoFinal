import bcrypt from 'bcrypt'

export class SaveUserDTO {
    constructor(payload) {
        this.first_name = payload.first_name;
        this.last_name = payload.last_name;
        this.email = payload.email;
        this.age = payload.age;
        this.password = payload.password
        this.cart = payload.cart || [];
        this.role = payload.role || 'user';
        this.active = true;
        this.full_name = `${payload.first_name} ${payload.last_name || ''}`.trim();
        this.documents = payload.documents || [];
        this.last_connection = null;
    }
}
