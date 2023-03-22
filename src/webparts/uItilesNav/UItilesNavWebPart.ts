import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse, HttpClientResponse } from '@microsoft/sp-http'
import { IListsUItile } from './loc/IListsUItile';

import styles from './UItilesNavWebPart.module.scss';
import * as strings from 'UItilesNavWebPartStrings';

import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
export interface IUItilesNavWebPartProps {
  description: string;
}

export default class UItilesNavWebPart extends BaseClientSideWebPart<IUItilesNavWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  props: any;

  public render(): void {
    this.domElement.innerHTML = `<style>
              .title{
                text-decoration:none; 
                color:white;
               
              }
              .wrap {
                overflow: hidden;
                margin: 10px;
              }
              #box {
                float: left;
                position: relative;
                width: 19.6vw;
                height: 19.6vw;
              }
              
              .boxInner {
                position: absolute;
                left: 10px;
                right: 10px;
                top: 10px;
                bottom: 10px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
                border-radius: 20px;
                
              }
              .boxInner:hover {
                -ms-transform: scale(1.05);
                -webkit-transform: scale(1.05);
                transform: scale(1.05);
            }
              .boxInner img {
                width: 100%;
              }
              
              .boxInner .titleBox {
                position: absolute;
                bottom: 50%;
                left: 0;
                right: 0;
                font-size: 2em;
                line-height: 1.1;
                background: #000;
                background: Black;
                color: #fff;
                padding: .3em;
                text-align: center;
              }
              
              @media only screen and (max-width : 480px) {
              
                /* Smartphone view: 1 tile */
                #box {
                  width: 100vw;
                  height: 100vw;
                }
              }
              
              @media only screen and (max-width : 650px) and (min-width : 481px) {
              
                /* Tablet view: 2 tiles */
                #box {
                  width: 47.9vw;
                  height: 47.9vw;
                }
              }
              
              @media only screen and (max-width : 1050px) and (min-width : 651px) {
              
                /* Small desktop / ipad view: 3 tiles */
                #box {
                  width: 32.3vw;
                  height: 32.3vw;
                }
              }
              
              @media only screen and (max-width : 1290px) and (min-width : 1051px) {
              
                /* Medium desktop: 4 tiles */
                #box {
                  width: 24.5vw;
                  height: 24.5vw;
                }
              }
          
              
          </style>
              <h1>updated version</h1>
          <div class="container">
              
                <div class="wrap">
                  
                </div>
          </div>`;

    this.ReadListItems();

  }
  private _getListItems(): Promise<IListsUItile[]> {
    const url: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Uitiles')/items";
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then(resposne => {
      return resposne.json();
    }).then(json => {
      return json.value;
    }) as Promise<IListsUItile[]>;

  }
  private async ReadListItems() {

    let htmlTile: string = '';
    let Listitems: IListsUItile[] = await this._getListItems();
    const sp = spfi().using(SPFx(this.context));

    // // simplest add a page example
    // const page = await sp.web.addClientsidePage("mypage1");



    var Rcolor: string[] = ["#ff96bd", "#ffb457", "#9999fb", "#ffe797", "#cffff1", "#f9cfff", "#cff5ff", "#d2ffcf", "#ffe1cf", "#ffcfd7"]
    for (const Listitem of Listitems) {
      let random = Rcolor[Math.floor(Math.random() * Rcolor.length)];
      var link = Listitem.Link;
      /*var headerofpage = (await this.context.httpClient.get(link, SPHttpClient.configurations.v1).then((res: HttpClientResponse) => {
        return res.statusText;
      })
      )*/
      // simplest load a page example
      var Slink = link.substring(link.indexOf(".com") + 4,
        link.lastIndexOf(".aspx") + 5);
      console.log(Slink)
      let page = await sp.web.loadClientsidePage(Slink);
      //const page2 = await Web([sp.web, "https://mstcllc.sharepoint.com/"]).loadClientsidePage("/sites/365Developers/SitePages/Sharepo.aspx");
      var Rstatus = (await this.context.httpClient.get(link, SPHttpClient.configurations.v1)).status

      console.log(page.title);
      if (page.title !== null) {

        /*htmlTile += `
        <div id="box"><div style="background-color: ${random};" class="boxInner">
              <div class="titleBox"><a href= ${Listitem.Link} class="title">${Listitem.Title}</a></div>
              </div></div>
              `;*/
        htmlTile += `<SecurityTrimmedControl context=${this.context}
                        level=${PermissionLevel.remoteWeb}
                        remoteSiteUrl="${Listitem.Link}"
                        permissions=${[SPPermission.viewPages, SPPermission.addListItems]}>
                        <div id="box"><div style="background-color: ${random};" class="boxInner">
                        <div class="titleBox"><a href= ${Listitem.Link} class="title">${Listitem.Title}</a></div>
                        </div></div>
                      </SecurityTrimmedControl>`;
      }

    };

    const tilecontainer: Element = this.domElement.querySelector('.wrap');

    tilecontainer.innerHTML = htmlTile;

  }



  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }



  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
