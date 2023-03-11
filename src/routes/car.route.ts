import { Router } from "express";
import {
  getCars,
  getCar,
  createCar,
  getCarBaseOnMake,
  getCarBaseOnLocation,
  getMakes,
  getModels,
  getCarBaseOnMakeAndModel,
  filterByPrice,
  getTotalCount,
  filterByAll,
  deleteCar,
} from "../controllers/car.controller";

const router = Router();

router.route("/cars").get(getCars);
router.route("/cars/:id").get(getCar);
router.route("/cars/make/:name").get(getCarBaseOnMake);
router.route("/cars/model/make").get(getCarBaseOnMakeAndModel);
router.route("/cars/location/:location").get(getCarBaseOnLocation);
router.route("/count").get(getTotalCount);
router.route("/makes").get(getMakes);
router.route("/prices").get(filterByPrice);
router.route("/prices/all").get(filterByAll);
router.route("/models/:model").get(getModels);
router.route("/cars").post(createCar);
router.route("/cars").delete(deleteCar);

export default router;
