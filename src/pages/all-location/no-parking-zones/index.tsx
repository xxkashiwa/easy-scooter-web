/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderWithDot from '@/components/header-with-dot';
import Map from '@/components/map';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import useBoundStore, { Bound } from '../bound-store';

const NoParkingZones: React.FC = () => {
  const { bounds, addBound, deleteBound, clearBounds } = useBoundStore();
  const [firstPoint, setFirstPoint] = useState<[number, number] | null>(null);
  const [currentPoint, setCurrentPoint] = useState<[number, number] | null>(
    null
  );
  const [drawMode, setDrawMode] = useState(false);
  const [selectedBoundId, setSelectedBoundId] = useState<number | null>(null);

  // Rectangle style settings
  const defaultStyle = { color: '#ff4136', weight: 2, opacity: 0.7 };
  const selectedStyle = {
    color: '#0074d9',
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.3,
  };
  const drawingStyle = {
    color: '#2ecc40',
    weight: 2,
    opacity: 0.7,
    dashArray: '5, 10',
  };

  // Generate a new unique ID for new bounds
  const getNewId = () => {
    return bounds.length > 0 ? Math.max(...bounds.map(b => b.id)) + 1 : 1;
  };

  // Mouse move handler for drawing preview
  useEffect(() => {
    if (!firstPoint || !drawMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 需要将屏幕坐标转换为地理坐标，但这在组件外部比较复杂
      // 我们在点击地图时更新 currentPoint 来实现预览
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [firstPoint, drawMode]);

  // Convert bound coordinates to LatLngBoundsExpression for the Map component
  const convertBoundsToLatLngBounds = (): L.LatLngBoundsExpression[] => {
    const result: L.LatLngBoundsExpression[] = bounds.map(bound => [
      [bound.coordinates[0][0], bound.coordinates[0][1]],
      [bound.coordinates[1][0], bound.coordinates[1][1]],
    ]);

    // 如果正在绘制中且有第一个点和当前点，添加预览矩形
    if (firstPoint && currentPoint && drawMode) {
      result.push([
        [firstPoint[0], firstPoint[1]],
        [currentPoint[0], currentPoint[1]],
      ]);
    }

    return result;
  };

  // Handle map click for drawing rectangles
  const handleMapClick = (coords: { lat: number; lng: number }) => {
    if (!drawMode) return;

    const point: [number, number] = [coords.lat, coords.lng];

    if (!firstPoint) {
      // First click - set first corner
      setFirstPoint(point);
      setCurrentPoint(point); // 初始化当前点
    } else {
      // Second click - create rectangle
      const newBound: Bound = {
        id: getNewId(),
        name: `矩形区域 ${getNewId()}`,
        coordinates: [firstPoint, point],
        color: defaultStyle.color,
        description: `创建于 ${new Date().toLocaleString()}`,
      };

      addBound(newBound);
      setFirstPoint(null);
      setCurrentPoint(null);
    }
  };

  // 处理地图移动（更新当前点，用于预览）
  const handleMapMove = (coords: { lat: number; lng: number }) => {
    if (drawMode && firstPoint) {
      setCurrentPoint([coords.lat, coords.lng]);
    }
  };

  // Handle clicking on a specific bound
  const handleBoundClick = (boundExpression: L.LatLngBoundsExpression) => {
    // 如果在绘制模式，不处理选择
    if (drawMode) return;

    // We need to identify which bound was clicked by matching coordinates
    const clickedBound = bounds.find(bound => {
      const boundAsLatLng = [
        [bound.coordinates[0][0], bound.coordinates[0][1]],
        [bound.coordinates[1][0], bound.coordinates[1][1]],
      ];
      return JSON.stringify(boundAsLatLng) === JSON.stringify(boundExpression);
    });

    if (clickedBound) {
      setSelectedBoundId(
        clickedBound.id === selectedBoundId ? null : clickedBound.id
      );
    }
  };

  // Handle deleting the selected bound
  const handleDeleteBound = () => {
    if (selectedBoundId !== null) {
      deleteBound(selectedBoundId);
      setSelectedBoundId(null);
    }
  };

  // 自定义渲染矩形的样式函数
  const getBoundStyle = (bound: L.LatLngBoundsExpression): L.PathOptions => {
    // 如果是预览矩形（最后一个项）
    if (firstPoint && currentPoint && drawMode) {
      const previewBound = [
        [firstPoint[0], firstPoint[1]],
        [currentPoint[0], currentPoint[1]],
      ];

      if (JSON.stringify(bound) === JSON.stringify(previewBound)) {
        return drawingStyle;
      }
    }

    // 找到对应的边界ID
    const boundObj = bounds.find(b => {
      const boundAsLatLng = [
        [b.coordinates[0][0], b.coordinates[0][1]],
        [b.coordinates[1][0], b.coordinates[1][1]],
      ];
      return JSON.stringify(boundAsLatLng) === JSON.stringify(bound);
    });

    // 根据选中状态返回不同样式
    if (boundObj && boundObj.id === selectedBoundId) {
      return selectedStyle;
    }

    return defaultStyle;
  };

  return (
    <div className="container mx-auto flex h-full flex-col p-4">
      <HeaderWithDot className="mb-4">No Parking Zones</HeaderWithDot>

      {/* Controls */}
      <div className="mb-4 flex space-x-2">
        <Button
          onClick={() => {
            setDrawMode(!drawMode);
            setFirstPoint(null);
            setCurrentPoint(null);
            setSelectedBoundId(null);
          }}
          variant={drawMode ? 'destructive' : 'default'}
        >
          {drawMode ? '取消绘制' : '绘制矩形'}
        </Button>
        <Button
          onClick={handleDeleteBound}
          variant="outline"
          disabled={selectedBoundId === null}
        >
          删除选中区域
        </Button>
        <Button
          onClick={() => {
            clearBounds();
            setSelectedBoundId(null);
          }}
          variant="outline"
        >
          清除所有区域
        </Button>
      </div>

      {/* Instructions */}
      {drawMode && (
        <div className="mb-4 rounded-md bg-yellow-100 p-3">
          <p className="text-sm">
            {!firstPoint
              ? '点击地图选择矩形的第一个角点'
              : '再次点击选择矩形的第二个角点完成绘制'}
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="min-h-[500px] flex-1 overflow-hidden rounded-lg border border-gray-300">
        <Map
          center={[30.76309138557076, 103.98528926875007]}
          zoom={15}
          className="h-full w-full"
          onMapClick={handleMapClick}
          onMouseMove={handleMapMove}
          bounds={convertBoundsToLatLngBounds()}
          onBoundClick={handleBoundClick}
          getBoundStyle={getBoundStyle}
        />
      </div>

      {/* Zones List */}
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-medium">矩形区域列表</h3>
        {bounds.length === 0 ? (
          <p className="text-gray-500">
            尚未定义任何矩形区域。使用"绘制矩形"按钮创建区域。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {bounds.map(bound => (
              <div
                key={bound.id}
                className={`cursor-pointer rounded-md border p-3 ${bound.id === selectedBoundId ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}
                onClick={() =>
                  setSelectedBoundId(
                    bound.id === selectedBoundId ? null : bound.id
                  )
                }
              >
                <div className="font-medium">{bound.name}</div>
                <div className="truncate text-sm text-gray-600">
                  {bound.description}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  坐标: [{bound.coordinates[0][0].toFixed(4)},{' '}
                  {bound.coordinates[0][1].toFixed(4)}] - [
                  {bound.coordinates[1][0].toFixed(4)},{' '}
                  {bound.coordinates[1][1].toFixed(4)}]
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoParkingZones;
