import * as Yup from 'yup';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

class LoginController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    const isValid = await schema.isValid(request.body, {
      strict: true,
      abortEarly: false,
    });

    const emailOrPasswordIsInvalid = () => {
      return response
        .status(400)
        .json({ error: 'email or password is invalid' });
    };

    if (!isValid) {
      emailOrPasswordIsInvalid();
    }

    const { email, password } = request.body;

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      emailOrPasswordIsInvalid();
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );

    if (!isPasswordCorrect) {
      emailOrPasswordIsInvalid();
    }

    return response.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
    });
  }
}

export default new LoginController();
