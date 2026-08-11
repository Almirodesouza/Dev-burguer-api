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

    const { name } = request.body;
    const {filename} = request.file;

    const existCategory = await Categories.findOne({ where: { name } });

    if (existCategory) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = await Categories.create({
      name,
      path: filename,
    });

    return response.status(201).json(newCategory);
  }

  async index(_request, response) {
    const categories = await Categories.findAll();

    return response.status(200).json(categories);
  }
}

export default new CategoriesController();
