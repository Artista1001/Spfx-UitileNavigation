import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
export interface IUItilesNavWebPartProps {
    description: string;
}
export default class UItilesNavWebPart extends BaseClientSideWebPart<IUItilesNavWebPartProps> {
    private _isDarkTheme;
    private _environmentMessage;
    props: any;
    render(): void;
    private _getListItems;
    private ReadListItems;
    protected onInit(): Promise<void>;
    private _getEnvironmentMessage;
    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=UItilesNavWebPart.d.ts.map