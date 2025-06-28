//package com.demo.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.demo.entity.Stock;
//import com.demo.service.StockService;
//
//@RestController
//@RequestMapping("/admin")
//public class AdminController {
//	@Autowired 
//	StockService srsp;
//	@PostMapping("/saves")//http://localhost:8080/admin/saves
//	public String save(@RequestBody Stock s) {
//		return srsp.save(s);
//		
//	}
//	
//	@GetMapping("/findall")//http://localhost:8080/admin/findall
//	public List finall() {
//		return srsp.findall();
//	}
//	
//	
//	@GetMapping("/findbyname/{name}")//http://localhost:8080/admin/findbyname/tcs
//	public List<Stock> findbyname(@PathVariable String name) {
//		return srsp.findByName(name);
//	}
//	
//	@DeleteMapping("/delete/{id}")//http://localhost:8080/stocks/delete/1
//	public String deletebyid(@PathVariable int id) {
//		return srsp.deletebyid(id);
//	}
//
//	@PutMapping("/update/{id}")//http://localhost:8080/admin/update/2
//	public String updateStock(@PathVariable int id,@RequestBody Stock newStock ) {
//		return srsp.updateStock(id, newStock);
//	}
//	
//
//}
