import type { WindowOptions } from "@tauri-apps/api/window";

export interface ModalOptions extends WindowOptions {
  url: string;
  modalId: string;
}

export interface ModalResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ModalData {
  resolve: (value: ModalResult | undefined) => void;
  reject: (reason?: any) => void;
  options: ModalOptions;
}
