import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { Splitter } from 'antd';
import { useMemo, useState } from 'react';

import styles from './app.module.css';

import type { NgwMap } from '@nextgis/ngw-map';
import type { MapContainerProps } from '@nextgis/react-ngw-map';

export const MobileLayout = ({
  setNgwMap,
  vh,
  children,
}: {
  setNgwMap: React.Dispatch<React.SetStateAction<NgwMap | undefined>>;
  vh: number;
  children: React.ReactNode;
}) => {
  const [splitPanel, toggleSplitPanel] = useState(true);
  const [mapHeight, setMapHeight] = useState(0.7 * vh);
  const onSplitterSnap = () => {
    toggleSplitPanel(!splitPanel);
    if (splitPanel) {
      setMapHeight(vh);
    }
    if (!splitPanel) {
      setMapHeight(0.7 * vh);
    }
  };

  const mapOptions: MapContainerProps = useMemo(
    () => ({
      id: 'map',
      style: {
        width: '100%',
        height: `${mapHeight}px`,
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
    [mapHeight],
  );

  return (
    <div className={styles.main}>
      <Splitter
        layout="vertical"
        onResize={(size) => {
          setMapHeight(vh - size[1]);
          console.log(vh, mapHeight, size[1]);
        }}
      >
        <Splitter.Panel defaultSize={0.7 * vh}>
          <ReactNgwMap {...mapOptions}></ReactNgwMap>
        </Splitter.Panel>
        {splitPanel && (
          <Splitter.Panel defaultSize={0.3 * vh}>{children}</Splitter.Panel>
        )}
      </Splitter>
      <div className={styles.snap} onClick={onSplitterSnap}></div>
    </div>
  );
};
