import User from '../models/User.js';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';

class UserController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false, strict: true });
    } catch (error) {
      return response.status(400).json({error: error.errors});
    }

    const { name, email, password, admin } = request.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return response.status(400).json({
        message: 'Email already registered!',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
      admin,
    });

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

export default new UserController();
