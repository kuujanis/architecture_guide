import { Checkbox } from 'antd';
import { useMemo } from 'react';

import styles from './legendPanel.module.css';

import type { NgwWebmapItem, NgwWebmapLayerAdapter } from '@nextgis/ngw-kit';
import type { NgwMap } from '@nextgis/ngw-map';

export const LegendPanel = ({ ngwMap }: { ngwMap: NgwMap }) => {
  const webmapAdapter = useMemo<NgwWebmapLayerAdapter>(() => {
    return ngwMap.getLayer('webmap') as NgwWebmapLayerAdapter;
  }, [ngwMap]);

  const layers = useMemo(() => {
    if (webmapAdapter.layer?.tree) {
      return webmapAdapter.layer.tree.getDescendants() as NgwWebmapItem[];
    } else {
      throw new Error('Resource is not `webmap` cls');
    }
  }, [webmapAdapter]);

  if (!webmapAdapter) {
    return null;
  }

  return (
    <div className={styles.legendContainer}>
      {/* <div className={styles.closeButton}></div> */}
      <div className={styles.layerOverflow}>
        {layers.map(({ id, item, properties }) => {
          return (
            <div key={id}>
              <Checkbox
                key={id}
                onChange={() => {
                  properties.set('visibility', !properties.get('visibility'));
                }}
              >
                {item.display_name} {properties.get('visibility') ? '1' : '0'}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
};
