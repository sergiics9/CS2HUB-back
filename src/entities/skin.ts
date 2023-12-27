import { ImgData } from '../types/img.data';
import { User } from './user';

export type Skin = {
  id: string;
  name: string;
  category: string;
  price: string;
  rarity: string;
  description: string;
  image: ImgData;
  collections_name: string;
  collections_image: ImgData;
  case_image: ImgData;
  case_name: string;
  author: User;
};
