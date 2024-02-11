import { Filter } from "../../../interfaces/repository";
import Video from "../../entities/Video/Video";

export interface CreatePostInput {
  autor_id: number;
  type: string;
  file?: string;
  title: string;
  description: string;
  video?: Video;
}
export interface UpdatePostInput {
  id: string;
  type: string;
  title: string;
  description: string;
  deslikes?: number;
  favorites?: number;
  shares?: number;
  created?: Date;
}
export interface ReadPostInput extends Filter {}
