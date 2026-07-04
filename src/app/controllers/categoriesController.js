import * as Yup from 'yup';
import Categories from '../models/Categories.js';

class CategoriesController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ error: error.errors });
    }

    const {name} = request.body;
    const newCategory = await Categories.create({
      name,
    });

    return response.status(201).json(newCategory);
  }

  async index(_request, response) {
    const categories = await Categories.findAll();

    return response.status(200).json(categories);
  }
}



export default new CategoriesController();