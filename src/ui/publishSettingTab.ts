import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianPublish from "../publish";
import ImageStore from "../imageStore";

export default class PublishSettingTab extends PluginSettingTab {
    private plugin: ObsidianPublish;
    private imageStoreDiv: HTMLDivElement;

    constructor(app: App, plugin: ObsidianPublish) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): any {
        const { containerEl } = this;
        containerEl.empty()
        containerEl.createEl("h1", { text: "Cloudflare Plugin settings" });

        const imageStoreTypeDiv = containerEl.createDiv();
        this.imageStoreDiv = containerEl.createDiv();

        new Setting(imageStoreTypeDiv)
            .setName("Enable Auto Upload Plugin")
            .setDesc("Automatically upload images when pasting them into the editor.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.autoUploadOnPaste)
                    .onChange(value => {
                        this.plugin.settings.autoUploadOnPaste = value;
                        // Show/hide R2 settings based on toggle
                        this.imageStoreDiv.style.display = value ? 'block' : 'none';
                    })
            );

        // Add visual styling to show R2 settings as nested/dependent
        this.imageStoreDiv.style.paddingLeft = '20px';
        this.imageStoreDiv.style.borderLeft = '2px solid var(--background-modifier-border)';
        this.imageStoreDiv.style.marginTop = '10px';
        this.imageStoreDiv.style.marginBottom = '20px';

        // Add a heading for R2 settings section
        this.imageStoreDiv.createEl('h3', {
            text: 'Cloudflare R2 Configuration',
            attr: { style: 'margin-top: 0; color: var(--text-muted);' }
        });

        // R2 settings (only these are nested under the toggle)
        this.drawR2Setting(this.imageStoreDiv);

        // Set initial visibility based on current setting
        this.imageStoreDiv.style.display = this.plugin.settings.autoUploadOnPaste ? 'block' : 'none';

        // Other independent settings (always visible, but appear after R2 settings)
        new Setting(imageStoreTypeDiv)
            .setName("Use image name as Alt Text")
            .setDesc("Whether to use image name as Alt Text with '-' and '_' replaced with space.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.imageAltText)
                    .onChange(value => this.plugin.settings.imageAltText = value)
            );

        new Setting(imageStoreTypeDiv)
            .setName("Update original document")
            .setDesc("Whether to replace internal link with store link.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.replaceOriginalDoc)
                    .onChange(value => this.plugin.settings.replaceOriginalDoc = value)
            );

        new Setting(imageStoreTypeDiv)
            .setName("Ignore note properties")
            .setDesc("Where to ignore note properties when copying to clipboard. This won't affect original note.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.ignoreProperties)
                    .onChange(value => this.plugin.settings.ignoreProperties = value)
            );
    }

    async hide(): Promise<any> {
        await this.plugin.saveSettings();
        this.plugin.setupImageUploader();
    }

    private async drawImageStoreSettings(parentEL: HTMLDivElement) {
        // Deprecated, using drawR2Setting directly
    }

    private drawR2Setting(parentEL: HTMLDivElement) {
        new Setting(parentEL)
            .setName('Cloudflare R2 Access Key ID')
            .setDesc('Your Cloudflare R2 access key ID')
            .addText(text => text
                .setPlaceholder('Enter your access key ID')
                .setValue(this.plugin.settings.r2Setting?.accessKeyId || '')
                .onChange(value => this.plugin.settings.r2Setting.accessKeyId = value
                ));

        new Setting(parentEL)
            .setName('Cloudflare R2 Secret Access Key')
            .setDesc('Your Cloudflare R2 secret access key')
            .addText(text => text
                .setPlaceholder('Enter your secret access key')
                .setValue(this.plugin.settings.r2Setting?.secretAccessKey || '')
                .onChange(value => this.plugin.settings.r2Setting.secretAccessKey = value));

        new Setting(parentEL)
            .setName('Cloudflare R2 Endpoint')
            .setDesc('Your Cloudflare R2 endpoint URL (e.g., https://account-id.r2.cloudflarestorage.com)')
            .addText(text => text
                .setPlaceholder('Enter your R2 endpoint')
                .setValue(this.plugin.settings.r2Setting?.endpoint || '')
                .onChange(value => this.plugin.settings.r2Setting.endpoint = value));

        new Setting(parentEL)
            .setName('Cloudflare R2 Bucket Name')
            .setDesc('Your Cloudflare R2 bucket name')
            .addText(text => text
                .setPlaceholder('Enter your bucket name')
                .setValue(this.plugin.settings.r2Setting?.bucketName || '')
                .onChange(value => this.plugin.settings.r2Setting.bucketName = value));

        new Setting(parentEL)
            .setName("Target Path")
            .setDesc("The path to store image.\nSupport {year} {mon} {day} {random} {filename} vars. For example, /{year}/{mon}/{day}/{filename} with uploading pic.jpg, it will store as /2023/06/08/pic.jpg.")
            .addText(text =>
                text
                    .setPlaceholder("Enter path")
                    .setValue(this.plugin.settings.r2Setting.path)
                    .onChange(value => this.plugin.settings.r2Setting.path = value));

        //custom domain
        new Setting(parentEL)
            .setName("R2.dev URL, Custom Domain Name")
            .setDesc("You can use the R2.dev URL such as https://pub-xxxx.r2.dev here, or custom domain. If the custom domain name is example.com, you can use https://example.com/pic.jpg to access pic.img.")
            .addText(text =>
                text
                    .setPlaceholder("Enter domain name")
                    .setValue(this.plugin.settings.r2Setting.customDomainName)
                    .onChange(value => this.plugin.settings.r2Setting.customDomainName = value));
    }
}