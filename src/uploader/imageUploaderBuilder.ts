import { PublishSettings } from "../publish";
import ImageUploader from "./imageUploader";
import R2Uploader from "./r2/r2Uploader";

export default function buildUploader(settings: PublishSettings): ImageUploader {
    return new R2Uploader(settings.r2Setting);
}