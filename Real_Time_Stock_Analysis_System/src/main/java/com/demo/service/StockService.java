package com.demo.service;

import com.demo.entity.Stock;
import com.demo.repository.StockRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    public Stock save(Stock stock) {
        return stockRepository.save(stock);
    }

    public Stock update(int id, Stock stock) {
        Stock existing = stockRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Stock Not Found"));
        
        existing.setName(stock.getName());
        existing.setImageUrl(stock.getImageUrl());
        existing.setPrice(stock.getPrice());
        existing.setOpenPrice(stock.getOpenPrice());
        existing.setClosePrice(stock.getClosePrice());
        existing.setVolume(stock.getVolume());
        existing.setUpdatedAt(stock.getUpdatedAt());
        
        return stockRepository.save(existing);
    }
    public void delete(int id) {
        stockRepository.deleteById(id);
    }
}
