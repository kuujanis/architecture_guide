import { Splitter } from 'antd';
import { useReducer } from 'react';

import styles from './app.module.css';

import type { BaseLayoutOptions } from './interfaces';

interface MobileLayoutOptions extends BaseLayoutOptions {
  vh: number;
}

export const MobileLayout = ({
  content,
  sidebar,
  vh,
  ...splitterOptions
}: MobileLayoutOptions) => {
  const [splitPanel, toggleSplitPanel] = useReducer((state) => !state, true);

  return (
    <div className={styles.main}>
      <Splitter layout="vertical" {...splitterOptions}>
        <Splitter.Panel defaultSize={0.7 * vh}>
          <div style={{ background: 'red', width: '100%', height: '100%' }}>
            {content}
          </div>
        </Splitter.Panel>
        {splitPanel && (
          <Splitter.Panel defaultSize={0.3 * vh}>{sidebar}</Splitter.Panel>
        )}
      </Splitter>
      <div className={styles.snap} onClick={toggleSplitPanel}></div>
    </div>
  );
};
