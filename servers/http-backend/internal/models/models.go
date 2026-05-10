package models

import (
	"time"
)

type Sender string

const (
	SenderUser Sender = "USER"
	SenderBot  Sender = "BOT"
)

type User struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	Chats     []Chat    `gorm:"foreignKey:UserID"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

type Chat struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Title     string    `gorm:"not null" json:"title"`
	UserID    string    `gorm:"not null" json:"userId"`
	Messages  []Message `gorm:"foreignKey:ChatID"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

type Message struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	Sender    Sender    `gorm:"type:text;not null" json:"sender"`
	ChatID    string    `gorm:"not null" json:"chatId"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
}
