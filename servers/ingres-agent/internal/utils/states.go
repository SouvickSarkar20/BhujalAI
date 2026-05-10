package utils

import "strings"

var IndianStates = []string{
	"Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
	"Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
	"Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
	"Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
	"Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
	"Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
	"Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
}

func IsIndianState(location string) bool {
	locLower := strings.ToLower(strings.TrimSpace(location))
	for _, state := range IndianStates {
		if strings.ToLower(state) == locLower {
			return true
		}
	}
	return false
}
