import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type { ModalOptions, ModalResult, ModalData } from "../types/modal";
import {
  getAllWindows,
  getCurrentWindow,
  Window,
} from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";

export class ModalManager {
  static #instance: ModalManager | null = null;
  #activeModals = new Map<string, ModalData>();
  #resultListeners = new Map<string, (result: ModalResult) => void>();
  #unlistenFunctions: UnlistenFn[] = [];

  private constructor() {
    this.#setupEventListeners();
  }

  public static getInstance(): ModalManager {
    if (!ModalManager.#instance) {
      ModalManager.#instance = new ModalManager();
    }
    return ModalManager.#instance;
  }

  async #setupEventListeners(): Promise<void> {
    try {
      // 监听模态窗口结果
      const unlisten = await listen<ModalResult>("modal-result", (event) => {
        const { modalId, ...resultData } = event.payload;
        const listener = this.#resultListeners.get(modalId as string);
        if (listener) {
          listener(resultData);
          this.#resultListeners.delete(modalId as string);
        }
      });

      this.#unlistenFunctions.push(unlisten);

      // 监听窗口错误
      const unlistenError = await listen<{ modalId: string; error: string }>(
        "modal-error",
        (event) => {
          const { modalId, error } = event.payload;
          const modalData = this.#activeModals.get(modalId);
          if (modalData) {
            modalData.reject(new Error(error));
            this.#activeModals.delete(modalId);
          }
        },
      );

      this.#unlistenFunctions.push(unlistenError);
    } catch (error) {
      console.error("Failed to setup event listeners:", error);
    }
  }

  #createModalWindow(options: ModalOptions): void {
    const currentWindow = getCurrentWindow();
    currentWindow.setEnabled(false);

    const { url, modalId, ...windowOptions } = options;
    const appWindow = new Window(modalId, windowOptions);
    appWindow.onCloseRequested(() => {
      console.log("close-requested");
      currentWindow.setEnabled(true);
    });
    appWindow.once("tauri://created", () => {
      console.log("window created");
    });
    appWindow.once("tauri://error", (e) => {
      console.log("window error", e);
    });

    const webview = new Webview(appWindow, modalId, {
      url: `${url}?modalId=${modalId}`,
      x: 0,
      y: 0,
      width: 500,
      height: 500,
    });
    webview.once("tauri://created", () => {
      console.log("webview created");
    });
    webview.once("tauri://error", (e) => {
      console.log("webview error", e);
    });
  }

  async #closeModalWindow(modalId: string) {
    const windows = await getAllWindows();
    const window = windows.find((window) => window.label === modalId);
    window?.close();
  }

  public async openModal<T = unknown>(
    options: ModalOptions,
  ): Promise<ModalResult<T>> {
    const modalId = options.modalId;
    const finalOptions: ModalOptions = {
      title: "Modal Window",
      width: 600,
      height: 400,
      center: true,
      resizable: false,
      ...options,
      modalId,
    };

    try {
      this.#createModalWindow(finalOptions);

      return new Promise<ModalResult<T>>((resolve, reject) => {
        this.#activeModals.set(modalId, {
          resolve,
          reject,
          options: finalOptions,
        });
        this.#resultListeners.set(modalId, (result) => {
          resolve(result as ModalResult<T>);
          this.#activeModals.delete(modalId);
        });
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to open modal: ${errorMessage}`);
    }
  }

  public async closeModal<T = unknown>(
    modalId: string,
    result?: T,
    error?: string,
  ): Promise<void> {
    try {
      console.log("active modals:", this.#activeModals);
      const modalData = this.#activeModals.get(modalId);
      if (!modalData) {
        throw new Error(`No active modal found with id: ${modalId}`);
      }

      // await invoke("close_modal_window", { modalId });
      await this.#closeModalWindow(modalId);

      const modalResult: ModalResult<T> = {
        success: !error,
        ...(error ? { error } : { data: result }),
      };

      modalData.resolve(modalResult);
      this.#activeModals.delete(modalId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to close modal: ${errorMessage}`);
    }
  }

  public async cleanup(): Promise<void> {
    // 清理所有事件监听器
    for (const unlisten of this.#unlistenFunctions) {
      unlisten();
    }
    this.#unlistenFunctions = [];

    // 关闭所有活跃的模态窗口
    for (const [modalId, modalData] of this.#activeModals) {
      try {
        await this.closeModal(modalId, undefined, "Modal manager cleanup");
      } catch (error) {
        console.error(`Failed to close modal ${modalId}:`, error);
      }
    }
  }
}

// 导出单例实例和便捷方法
export const modalManager = ModalManager.getInstance();

export async function openModalWindow<T = unknown>(
  options: ModalOptions,
): Promise<ModalResult<T>> {
  return modalManager.openModal<T>(options);
}

export async function closeModalWindow<T = unknown>(
  modalId: string,
  result?: T,
  error?: string,
): Promise<void> {
  return modalManager.closeModal(modalId, result, error);
}
