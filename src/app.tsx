// import ReactNgwMap from '@nextgis/react-ngw-ol';
import { ConfigProvider } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useViewport } from 'react-viewport-hooks';

import { LegendPanel } from './panels/legendPanel';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { NgwIdentifyEvent, NgwMap } from '@nextgis/ngw-map';
import type { Point } from 'geojson';

import type { ArchitectureFields } from './types';

export const App = () => {
  const { vw, vh } = useViewport();
  console.log(vw, vh);

  const [ngwMap, setNgwMap] = useState<NgwMap>();
  const [selectedItem, setSelectedItem] = useState<
    IdentifyItem<ArchitectureFields, Point>[]
  >([]);

  const onMapClick = useCallback((e: NgwIdentifyEvent | null) => {
    if (e) {
      const items = e.getIdentifyItems() as IdentifyItem<
        ArchitectureFields,
        Point
      >[];
      console.log(items);
      setSelectedItem(items);
      console.log(selectedItem);
    }
    console.log('map click');
  }, []);

  useEffect(() => {
    if (ngwMap) {
      ngwMap.emitter.on('ngw:select', onMapClick);
    }
    return () => {
      if (ngwMap) {
        ngwMap.emitter.off('ngw:select', onMapClick);
      }
    };
  }, [ngwMap, onMapClick]);

  const Legend = () => {
    return (
      <div>
        {ngwMap ? (
          <LegendPanel ngwMap={ngwMap} />
        ) : (
          <div className="test">
            <h1>LOADING...</h1>
          </div>
        )}
      </div>
    );
  };

  const Info = () => {
    return (
      <div>
        {selectedItem ? (
          <div>
            <h1>INFO</h1>
          </div>
        ) : (
          <div className="test">
            <h1>LOADING...</h1>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Splitter: {
              splitTriggerSize: 50,
            },
          },
        }}
      >
        {vw > vh ? (
          <DesktopLayout vw={vw} setNgwMap={setNgwMap}>
            {<Legend />}
          </DesktopLayout>
        ) : (
          <MobileLayout vh={vh} setNgwMap={setNgwMap}>
            <Legend />
          </MobileLayout>
        )}
      </ConfigProvider>
    </div>
  );
};
