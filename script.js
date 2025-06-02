/* Search Box */
#search-box {
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-right: 10px;
  font-size: 0.9rem;
}

/* Speaking Button */
.speak-btn {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 10px;
}

.speak-btn:hover {
  background: #45a049;
}

/* Language Grid */
.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.language-grid span {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.language-grid span:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Feature Cards */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.feature-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-item {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Quick Languages */
.quick-languages {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-top: 30px;
}

.language-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.language-buttons button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.language-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Error Message */
.error-message {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
}

/* Contact Form */
.contact-info {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.contact-icon {
  font-size: 2rem;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .language-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
