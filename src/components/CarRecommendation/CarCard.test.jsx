import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarCard from './CarCard';

describe('CarCard - 促销标签功能', () => {
  const mockOnLike = jest.fn();
  const mockOnView = jest.fn();
  const mockOnVehicleClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('促销标签优先级', () => {
    test('优先级1: viewUV >= 100 显示"围观人数"标签（红色）', () => {
      const car = {
        id: 1,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 150,
        bidderCount: 5,
        turnoverScore: 80,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      const tag = screen.getByText('围观人数');
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass('bg-red-500');
    });

    test('优先级2: viewUV < 100 且 bidderCount > 3 显示"多人意向"标签（橙色）', () => {
      const car = {
        id: 2,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 80,
        bidderCount: 5,
        turnoverScore: 80,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      const tag = screen.getByText('多人意向');
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass('bg-orange-500');
    });

    test('优先级3: viewUV < 100 且 bidderCount <= 3 且 turnoverScore > 70 显示"周转快"标签（绿色）', () => {
      const car = {
        id: 3,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 80,
        bidderCount: 2,
        turnoverScore: 75,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      const tag = screen.getByText('周转快');
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass('bg-green-500');
    });

    test('不满足任何条件时不显示促销标签', () => {
      const car = {
        id: 4,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 50,
        bidderCount: 2,
        turnoverScore: 60,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      expect(screen.queryByText('围观人数')).not.toBeInTheDocument();
      expect(screen.queryByText('多人意向')).not.toBeInTheDocument();
      expect(screen.queryByText('周转快')).not.toBeInTheDocument();
    });
  });

  describe('边界值测试', () => {
    test('viewUV = 100 应该显示"围观人数"', () => {
      const car = {
        id: 5,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 100,
        bidderCount: 2,
        turnoverScore: 60,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      expect(screen.getByText('围观人数')).toBeInTheDocument();
    });

    test('bidderCount = 3 不应该显示"多人意向"', () => {
      const car = {
        id: 6,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 50,
        bidderCount: 3,
        turnoverScore: 60,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      expect(screen.queryByText('多人意向')).not.toBeInTheDocument();
    });

    test('turnoverScore = 70 不应该显示"周转快"', () => {
      const car = {
        id: 7,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 50,
        bidderCount: 2,
        turnoverScore: 70,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      expect(screen.queryByText('周转快')).not.toBeInTheDocument();
    });
  });

  describe('缺失字段处理', () => {
    test('缺少 viewUV 字段时应该视为 0', () => {
      const car = {
        id: 8,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        // viewUV 缺失
        bidderCount: 5,
        turnoverScore: 80,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      // 应该显示"多人意向"因为 viewUV 被视为 0，bidderCount > 3
      expect(screen.getByText('多人意向')).toBeInTheDocument();
    });
  });

  describe('车辆状态异常处理', () => {
    test('点击 status="removed" 的车辆应该显示提示', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      const car = {
        id: 9,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 100,
        bidderCount: 5,
        turnoverScore: 80,
        status: 'removed',
        image: 'test.jpg',
        transferCount: 0
      };

      const { container } = render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      const card = container.firstChild;
      fireEvent.click(card);

      expect(alertSpy).toHaveBeenCalledWith('该车辆已下架，请刷新页面');
      expect(mockOnVehicleClick).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    test('点击 status="ended" 的车辆应该显示提示', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      const car = {
        id: 10,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 100,
        bidderCount: 5,
        turnoverScore: 80,
        status: 'ended',
        image: 'test.jpg',
        transferCount: 0
      };

      const { container } = render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      const card = container.firstChild;
      fireEvent.click(card);

      expect(alertSpy).toHaveBeenCalledWith('该车辆竞价已结束，请刷新页面');
      expect(mockOnVehicleClick).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    test('点击 status="active" 的车辆应该调用 onVehicleClick', () => {
      const car = {
        id: 11,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 100,
        bidderCount: 5,
        turnoverScore: 80,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      const { container } = render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      const card = container.firstChild;
      fireEvent.click(card);

      expect(mockOnVehicleClick).toHaveBeenCalledWith(11);
    });
  });

  describe('出价人数显示', () => {
    test('当 bidderCount > 0 时应该显示出价人数', () => {
      const car = {
        id: 12,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 100,
        bidderCount: 5,
        turnoverScore: 80,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      expect(screen.getByText('5人出价')).toBeInTheDocument();
    });

    test('当 bidderCount = 0 时不应该显示出价人数', () => {
      const car = {
        id: 13,
        name: '测试车辆',
        brand: '测试品牌',
        year: 2022,
        price: 200000,
        mileage: 30000,
        location: '北京',
        viewUV: 100,
        bidderCount: 0,
        turnoverScore: 80,
        status: 'active',
        image: 'test.jpg',
        transferCount: 0
      };

      render(
        <CarCard
          car={car}
          onLike={mockOnLike}
          onView={mockOnView}
          onVehicleClick={mockOnVehicleClick}
          isLiked={false}
        />
      );

      expect(screen.queryByText(/人出价/)).not.toBeInTheDocument();
    });
  });
});
