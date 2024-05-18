import {
  Injectable,
  inject,
  Injector,
  Type,
  ViewContainerRef,
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root',
})
export class Popup {
  private readonly _injector = inject(Injector);
  private readonly _parentWindowDocument = inject(DOCUMENT);
  private _headObserver!: MutationObserver;
  private _bodyClassAttributeObserver!: MutationObserver;

  constructor(private readonly _externalWindow: Window) {}

  get externalWindow() {
    return this._externalWindow;
  }

  appendComponent<T>(component: Type<T>): ComponentRef<T> {
    if (!component) {
      throw new TypeError('Must provide a valid component!');
    }

    const customInjector = this._createInjector();

    const portal = this._createComponentPortal(component, customInjector);

    const host = this._createPortalOutlet(customInjector);

    this._createHeadObserver();

    this._createBodyClassAttributeObserver();

    return host.attach(portal);
  }

  close() {
    this.stopStylesSync();
    this.externalWindow.close();
  }

  startStylesSync() {
    this._bodyClassAttributeObserver.observe(this._parentWindowDocument.body, {
      attributeFilter: ['class'],
      attributes: true,
    });

    this._headObserver.observe(this._parentWindowDocument.head, {
      childList: true,
    });
  }

  stopStylesSync() {
    this._bodyClassAttributeObserver.disconnect();
    this._headObserver.disconnect();
  }

  private _createInjector(): Injector {
    return Injector.create({
      providers: [
        {
          provide: DOCUMENT,
          useFactory: () => this._externalWindow.document,
        },
        {
          provide: OverlayContainer,
          useFactory: (document: any, platform: Platform): OverlayContainer =>
            new OverlayContainer(document, platform),
          deps: [DOCUMENT, Platform],
        },
        {
          provide: Overlay,
          useClass: Overlay,
        },
      ],
      parent: this._injector,
    });
  }

  private _createComponentPortal<T>(
    component: Type<T>,
    injector: Injector
  ): ComponentPortal<T> {
    return new ComponentPortal(
      component,
      injector.get(ViewContainerRef),
      injector.get(Injector),
      injector.get(ComponentFactoryResolver)
    );
  }

  private _createPortalOutlet(injector: Injector): DomPortalOutlet {
    return new DomPortalOutlet(
      this.externalWindow.document.body,
      injector.get(ComponentFactoryResolver),
      injector.get(ApplicationRef),
      injector
    );
  }

  private _createHeadObserver() {
    this._headObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) =>
            this._externalWindow.document.head.appendChild(node.cloneNode(true))
          );
        }
      }
    });
  }

  private _createBodyClassAttributeObserver() {
    this._bodyClassAttributeObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const newClassList = (
            mutation.target as HTMLBodyElement
          ).classList.toString();
          this._externalWindow.document.body.classList.value = newClassList;
        }
      }
    });
  }
}
