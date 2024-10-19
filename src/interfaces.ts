import type { SplitterProps } from 'antd';

export interface BaseLayoutOptions extends SplitterProps {
  // setNgwMap: React.Dispatch<React.SetStateAction<NgwMap | undefined>>;
  // vh: number;
  content: React.ReactNode;
  sidebar: React.ReactNode;
}
