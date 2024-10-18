import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { Splitter } from 'antd';
import { useMemo, useState } from 'react';

import styles from './app.module.css';

import type { NgwMap } from '@nextgis/ngw-map';
import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type { ReactNode } from 'react';

export const DesktopLayout = ({
  setNgwMap,
  vw,
  children,
}: {
  setNgwMap: React.Dispatch<React.SetStateAction<NgwMap | undefined>>;
  vw: number;
  children: ReactNode;
}) => {
  const [splitPanel, toggleSplitPanel] = useState(true);
  const [mapWidth, setMapWidth] = useState(0.7 * vw);
  const onSplitterSnap = () => {
    toggleSplitPanel(!splitPanel);
    if (splitPanel) {
      setMapWidth(vw);
    }
    if (!splitPanel) {
      setMapWidth(0.7 * vw);
    }
  };

  const mapOptions: MapContainerProps = useMemo(
    () => ({
      id: 'map',
      style: {
        width: `${mapWidth}px`,
        height: '100%',
        border: '2px solid red',
      },
      resources: [
        {
          resource: 1,
          id: 'webmap',
          fit: true,
          adapterOptions: { selectable: true },
        },
      ],
      whenCreated: (n) => {
        setNgwMap(n);
      },
    }),
    [mapWidth],
  );

  return (
    <div className={styles.main}>
      <Splitter
        onResize={(size) => {
          setMapWidth(vw - size[1]);
          console.log(vw, mapWidth, size[1]);
        }}
        onResizeEnd={(size) => {
          if (size[1] < 0.1 * vw) {
            onSplitterSnap();
          }
        }}
      >
        <Splitter.Panel defaultSize={0.7 * vw}>
          <ReactNgwMap {...mapOptions}></ReactNgwMap>
        </Splitter.Panel>
        {splitPanel && (
          <Splitter.Panel defaultSize={0.3 * vw} max={0.4 * vw}>
            {children}
          </Splitter.Panel>
        )}
      </Splitter>
      <div className={styles.snap} onClick={onSplitterSnap}></div>
    </div>
  );
};
