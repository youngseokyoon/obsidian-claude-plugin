import { App, Notice, Editor } from "obsidian";
import ImageUploader from "./uploader/imageUploader";
import { PublishSettings } from "./publish";

export default class PasteListener {
    private app: App;
    private getSettings: () => PublishSettings;
    private getImageUploader: () => ImageUploader;

    constructor(app: App, getSettings: () => PublishSettings, getImageUploader: () => ImageUploader) {
        this.app = app;
        this.getSettings = getSettings;
        this.getImageUploader = getImageUploader;
    }

    public async handlePaste(evt: ClipboardEvent, editor: Editor): Promise<void> {
        const settings = this.getSettings();
        if (!settings.autoUploadOnPaste) {
            return;
        }

        const files = evt.clipboardData?.files;
        if (!files || files.length === 0) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith("image/")) {
                evt.preventDefault();
                evt.stopPropagation();

                // Generate a unique filename
                const extension = file.type.split("/")[1] || "png";
                let filenameBase = "";

                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile) {
                    const frontmatter = this.app.metadataCache.getFileCache(activeFile)?.frontmatter;
                    if (frontmatter && frontmatter["imageNameKey"]) {
                        filenameBase = `${frontmatter["imageNameKey"]}-`;
                    }
                }

                const randomString = this.generateRandomString(12);
                const filename = `${filenameBase}${randomString}.${extension}`;

                new Notice(`Uploading ${filename}...`);

                try {
                    // Upload the image
                    const uploader = this.getImageUploader();
                    const imgUrl = await uploader.upload(file, filename);

                    // Insert the image link at the cursor
                    const cursor = editor.getCursor();
                    const altText = settings.imageAltText ? filename.replace(/\.[^/.]+$/, "") : "";
                    const imageLink = `![${altText}](${imgUrl})`;
                    editor.replaceRange(imageLink, cursor);

                    new Notice(`Uploaded ${filename}`);
                } catch (e) {
                    new Notice(`Failed to upload ${filename}: ${e.message || e}`);
                    console.error(`Failed to upload ${filename}:`, e);
                }
            }
        }
    }

    private generateRandomString(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
