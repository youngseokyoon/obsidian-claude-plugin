export default class ImageStore {
    private static readonly values: ImageStore[] = [];

    static get lists(): ReadonlyArray<ImageStore> {
        return this.values;
    }

    static readonly CLOUDFLARE_R2 = new ImageStore(
        "CLOUDFLARE_R2",
        "Cloudflare R2"
    )

    private constructor(readonly id: string, readonly description: string) {
        ImageStore.values.push(this)
    }
}