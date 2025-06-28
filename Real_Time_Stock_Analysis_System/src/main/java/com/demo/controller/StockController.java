package com.demo.controller;

import com.demo.entity.Stock;
import com.demo.service.StockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stocks")
@CrossOrigin(origins="http://localhost:3000")

public class StockController {

    @Autowired
    private StockService stockService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/findall")
    public List<Stock> findAll() {
        return stockService.findAll();
    }

    @PostMapping("/saves")
    public Stock saveStock(@RequestBody Stock stock) {
        Stock saved = stockService.save(stock);
        notifyStockUpdate();
        return saved;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStock(@PathVariable int id, @RequestBody Stock updatedStock) {
        Stock updated = stockService.update(id, updatedStock);  // ✅ direct use update method
        notifyStockUpdate(); // ✅ broadcast WebSocket
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteStock(@PathVariable int id) {
        stockService.delete(id);
        notifyStockUpdate();
    }

    // WebSocket notification method
    private void notifyStockUpdate() {
        List<Stock> allStocks = stockService.findAll();
        messagingTemplate.convertAndSend("/topic/stocks", allStocks);
    }
}


//{
	  //"name": "TCS",
	 // "imageUrl": "https://i.pinimg.com/736x/57/43/f4/5743f41d817128271ed7446944969e1c.jpg",
	  //"price": 3000,
	  //"openPrice": 2995,
	 // "closePrice": 3500,
	//  "volume": 445555,
	 // "updatedAt": "2025-06-12T21:33:00"  // ✅ Proper ISO datetime format
	//}
