// 推荐算法引擎

// 模拟车辆数据
const mockCars = [
  {
    id: 1,
    name: '奔驰 E300L 2022款',
    brand: '奔驰',
    year: 2022,
    price: 350000,
    originalPrice: 380000,
    mileage: 25000,
    location: '北京',
    views: 1234,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    auctionStatus: '2小时后结束',
    tags: ['豪华', 'sedan', '低里程']
  },
  {
    id: 2,
    name: '宝马 5系 530Li 2021款',
    brand: '宝马',
    year: 2021,
    price: 320000,
    mileage: 38000,
    location: '上海',
    views: 987,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    auctionStatus: '进行中',
    tags: ['豪华', 'sedan', '运动']
  },
  {
    id: 3,
    name: '特斯拉 Model 3 2023款',
    brand: '特斯拉',
    year: 2023,
    price: 245000,
    mileage: 12000,
    location: '深圳',
    views: 2156,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    tags: ['电动', 'sedan', '智能']
  },
  {
    id: 4,
    name: '奥迪 A6L 45TFSI 2022款',
    brand: '奥迪',
    year: 2022,
    price: 380000,
    mileage: 18000,
    location: '广州',
    views: 876,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    auctionStatus: '1天后结束',
    tags: ['豪华', 'sedan', '商务']
  },
  {
    id: 5,
    name: '比亚迪 汉EV 2023款',
    brand: '比亚迪',
    year: 2023,
    price: 220000,
    mileage: 8000,
    location: '杭州',
    views: 1543,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    tags: ['电动', 'sedan', '国产']
  },
  {
    id: 6,
    name: '丰田 凯美瑞 2021款',
    brand: '丰田',
    year: 2021,
    price: 165000,
    mileage: 45000,
    location: '成都',
    views: 654,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    tags: ['可靠', 'sedan', '省油']
  },
  {
    id: 7,
    name: '本田 雅阁 2022款',
    brand: '本田',
    year: 2022,
    price: 185000,
    mileage: 28000,
    location: '武汉',
    views: 789,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
    auctionStatus: '5小时后结束',
    tags: ['可靠', 'sedan', '运动']
  },
  {
    id: 8,
    name: '蔚来 ET5 2023款',
    brand: '蔚来',
    year: 2023,
    price: 280000,
    mileage: 15000,
    location: '南京',
    views: 1876,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
    tags: ['电动', 'sedan', '智能', '国产']
  },
  {
    id: 9,
    name: '理想 L8 2023款',
    brand: '理想',
    year: 2023,
    price: 330000,
    mileage: 10000,
    location: '北京',
    views: 2345,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    auctionStatus: '3小时后结束',
    tags: ['增程', 'suv', '智能', '国产']
  },
  {
    id: 10,
    name: '小鹏 P7 2022款',
    brand: '小鹏',
    year: 2022,
    price: 235000,
    mileage: 22000,
    location: '广州',
    views: 1234,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    tags: ['电动', 'sedan', '智能', '国产']
  },
  {
    id: 11,
    name: '大众 帕萨特 2021款',
    brand: '大众',
    year: 2021,
    price: 155000,
    mileage: 52000,
    location: '天津',
    views: 543,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
    tags: ['商务', 'sedan', '稳重']
  },
  {
    id: 12,
    name: '吉利 星越L 2023款',
    brand: '吉利',
    year: 2023,
    price: 145000,
    mileage: 6000,
    location: '杭州',
    views: 876,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
    auctionStatus: '进行中',
    tags: ['suv', '国产', '性价比']
  }
];

// 计算推荐分数
const calculateScore = (car, userPreferences) => {
  let score = 0;

  // 基于浏览历史的品牌偏好
  const viewedBrands = userPreferences.viewedCars
    .map(id => mockCars.find(c => c.id === id)?.brand)
    .filter(Boolean);
  
  if (viewedBrands.includes(car.brand)) {
    score += 30;
  }

  // 基于收藏的相似度
  const likedCars = userPreferences.likedCars
    .map(id => mockCars.find(c => c.id === id))
    .filter(Boolean);

  likedCars.forEach(likedCar => {
    // 价格相似度
    const priceDiff = Math.abs(car.price - likedCar.price);
    if (priceDiff < 50000) score += 20;
    else if (priceDiff < 100000) score += 10;

    // 年份相似度
    if (Math.abs(car.year - likedCar.year) <= 1) score += 15;

    // 标签匹配
    const commonTags = car.tags.filter(tag => likedCar.tags.includes(tag));
    score += commonTags.length * 10;
  });

  // 热度加成
  score += Math.min(car.views / 100, 20);

  // 拍卖状态加成
  if (car.auctionStatus) score += 15;

  // 低里程加成
  if (car.mileage < 30000) score += 10;

  // 新车加成
  if (car.year >= 2022) score += 10;

  return score;
};

// 应用筛选条件
const applyFilters = (cars, filters) => {
  return cars.filter(car => {
    // 价格筛选
    if (car.price > filters.priceRange[1]) return false;

    // 品牌筛选
    if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) {
      return false;
    }

    // 年份筛选
    if (filters.years.length > 0 && !filters.years.includes(car.year)) {
      return false;
    }

    // 里程筛选
    if (car.mileage > filters.mileage[1]) return false;

    return true;
  });
};

// 生成推荐理由
const generateRecommendReason = (car, userPreferences) => {
  const viewedBrands = userPreferences.viewedCars
    .map(id => mockCars.find(c => c.id === id)?.brand)
    .filter(Boolean);

  if (viewedBrands.includes(car.brand)) {
    return `您浏览过${car.brand}品牌`;
  }

  if (car.auctionStatus) {
    return '热门拍卖中';
  }

  if (car.mileage < 20000) {
    return '低里程精品车';
  }

  if (car.year >= 2023) {
    return '准新车推荐';
  }

  return '热门推荐';
};

// 主推荐函数
export const getRecommendations = (userPreferences, filters) => {
  // 应用筛选
  let filteredCars = applyFilters(mockCars, filters);

  // 计算推荐分数
  const carsWithScores = filteredCars.map(car => ({
    ...car,
    score: calculateScore(car, userPreferences),
    recommendReason: generateRecommendReason(car, userPreferences)
  }));

  // 按分数排序
  carsWithScores.sort((a, b) => b.score - a.score);

  return carsWithScores;
};

// 获取相似车辆
export const getSimilarCars = (carId, limit = 4) => {
  const targetCar = mockCars.find(c => c.id === carId);
  if (!targetCar) return [];

  const similarCars = mockCars
    .filter(c => c.id !== carId)
    .map(car => {
      let similarity = 0;
      
      if (car.brand === targetCar.brand) similarity += 40;
      
      const priceDiff = Math.abs(car.price - targetCar.price);
      if (priceDiff < 50000) similarity += 30;
      else if (priceDiff < 100000) similarity += 15;
      
      if (Math.abs(car.year - targetCar.year) <= 1) similarity += 20;
      
      const commonTags = car.tags.filter(tag => targetCar.tags.includes(tag));
      similarity += commonTags.length * 10;

      return { ...car, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarCars;
};
