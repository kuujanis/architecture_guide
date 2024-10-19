// import ReactNgwMap from '@nextgis/react-ngw-ol';
import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { ConfigProvider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useViewport } from 'react-viewport-hooks';

import type { Map } from 'leaflet';

import { LegendPanel } from './panels/legendPanel';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { NgwIdentifyEvent, NgwMap } from '@nextgis/ngw-map';
import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type { Point } from 'geojson';

import type { ArchitectureFields } from './types';

export const App = () => {
  const { vw, vh } = useViewport();
  console.log(vw, vh);

  const [ngwMap, setNgwMap] = useState<NgwMap<Map>>();
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

  const mapOptions: MapContainerProps = useMemo(
    () => ({
      id: 'map',
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
    [],
  );

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

  const onResize = useCallback(() => {
    if (ngwMap) {
      ngwMap.mapAdapter.map?.invalidateSize();
    }
  }, [ngwMap]);

  useEffect(() => {
    onResize();
  }, [onResize]);

  // const Info = () => {
  //   return (
  //     <div>
  //       {selectedItem ? (
  //         <div>
  //           <h1>INFO</h1>
  //         </div>
  //       ) : (
  //         <div className="test">
  //           <h1>LOADING...</h1>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
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
        <DesktopLayout
          vw={vw}
          setNgwMap={() => {
            //
          }}
        >
          <Legend />
        </DesktopLayout>
      ) : (
        <MobileLayout
          vh={vh}
          content={<ReactNgwMap {...mapOptions}></ReactNgwMap>}
          sidebar={<Legend />}
          onResize={onResize}
        ></MobileLayout>
      )}
    </ConfigProvider>
  );
};
