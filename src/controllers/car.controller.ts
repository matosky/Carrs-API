import { Request, Response } from "express";
import { v2 } from "cloudinary";

import Car from "../models/Car.model";
import { uploadImage } from "../utils/uploadImage";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CarInterface {
  _id: string;
  name: string;
  model: string;
  description: string;
  price: string;
  distance: string;
  fuel_type: string;
  photo_url: string;
  color: string;
  year: string;
  location: string;
  createdAt: string;
}

export const getCars = async (req: Request, res: Response) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;
    let offset = (page - 1) * limit;

    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    res.json({
      status: "success",
      data: cars,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

export const getTotalCount = async (req: Request, res: Response) => {
  try {
    const count = await Car.find().countDocuments();
    res.json({
      status: "success",
      data: count,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

export const getCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json({
      status: "success",
      data: car,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
export const getMakes = async (req: Request, res: Response) => {
  try {
    const makes = await Car.find({}).select("name model location");
    let obj: any = {};
    makes.forEach((v: any) => {
      if (obj[v.name]) {
        obj[v.name] += 1;
      } else {
        obj[v.name] = 1;
      }
    });

    let key = Object.keys(obj);
    let value = Object.values(obj);

    let data: any[] = [];

    for (let v in key) {
      data.push({ make: key[v], count: value[v] });
    }

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
export const getModels = async (req: Request, res: Response) => {
  try {
    let name = req.params.model.toLowerCase();
    const car = await Car.find({
      name,
    }).select("model name");

    let obj: any = {};
    car.forEach((v: any) => {
      if (obj[v.model]) {
        obj[v.model] += 1;
      } else {
        obj[v.model] = 1;
      }
    });

    let key = Object.keys(obj);
    let value = Object.values(obj);

    let data: any[] = [];

    for (let v in key) {
      data.push({ model: key[v], count: value[v] });
    }

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
export const getCarBaseOnMake = async (req: Request, res: Response) => {
  try {
    let name = req.params.name.toLowerCase();
    const car = await Car.find({
      name,
    });
    res.json({
      status: "success",
      data: car,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
export const getCarBaseOnMakeAndModel = async (req: Request, res: Response) => {
  try {
    let model = req.query.model && req.query.model.toLowerCase();
    let name = req.query.make && req.query.make.toLowerCase();

    if (!model && !name) {
      res.status(404).json({ status: "error", error: "Not found" });
    }
    const car = await Car.find({
      model,
      name,
    });
    res.json({
      status: "success",
      data: car,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
export const getCarBaseOnLocation = async (req: Request, res: Response) => {
  try {
    let location = req.params.location.toLowerCase();
    const car = await Car.find({
      location,
    });
    res.json({
      status: "success",
      data: car,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

export const filterByPrice = async (req: Request, res: Response) => {
  try {
    let min = req.query.min;
    let max = req.query.max;

    const price = await Car.find();

    let data = price.filter(
      (p: any) =>
        Number(p.price) >= Number(min) && Number(p.price) <= Number(max)
    );

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

export const filterByAll = async (req: Request, res: Response) => {
  try {
    let min = req.query.min;
    let max = req.query.max;
    let make = req.query.make;
    let model = req.query.model;

    const price = await Car.find({
      make,
      model,
    });

    let data = price.filter(
      (p: any) =>
        Number(p.price) >= Number(min) && Number(p.price) <= Number(max)
    );

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

export const createCar = async (req: any, res: Response) => {
  try {
    const files = req.files.file;
    console.log(files);
    let imgArray: any = [];
    // if (files) {

    // }
    for (let i = 0; i < files.length; i++) {
      const img = await uploadImage(files[i]);
      imgArray.push(img.secure_url);
    }
    console.log({ imgArray });
    const car = new Car({ ...req.body, photo_url: JSON.stringify(imgArray) });
    await car.save();
    res.json({
      status: "success",
      data: car,
    });
    // else {
    //   const car = new Car(req.body);
    //   await car.save();
    //   res.json({
    //     status: "success",
    //     data: car,
    //   });
    // }
  } catch (error) {
    console.log(error.message.split(":"));
    res.status(404).json({
      status: "error",
      error: error.message
        .split(":")
        .slice(2)
        .map((e: string) => ({
          [e.trim().split(" ")[0]]: e.trim().split(",")[0],
        })),
    });
  }
};

export const deleteCar = async (req: any, res: any) => {
  try {
    await Car.remove({});
    res.json({ status: "success" });
  } catch (error) {}
};
