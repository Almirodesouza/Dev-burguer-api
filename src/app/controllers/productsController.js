import * as Yup from 'yup';
import Products from '../models/Products.js';
import Categories from '../models/Categories.js';

class ProductsController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ error: error.errors });
    }

    const { name, price, category_id, offer } = request.body;
    const { filename } = request.file;

    const newProduct = await Products.create({
      name,
      price,
      category_id,
      path: filename,
      offer
    });

    return response.status(201).json(newProduct);
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ error: error.errors });
    }

    const { name, price, category_id, offer } = request.body;
    const { id } = request.params;

    let path
    if (request.file) {
      const { filename } = request.file;
      path = filename;
    }
    

   await Products.update({
      name,
      price,
      category_id,
      path,
      offer
    },{
      where: {
        id,
      }
    });

    return response.status(200).json();
  }

  async index(_request, response) {
    const products = await Products.findAll({
      include: {
        model: Categories,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });

    return response.status(200).json(products);
  }
}

export default new ProductsController();
