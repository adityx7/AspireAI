#!/bin/bash

# ============================================================
# Semester Academics Setup Script
# ============================================================
# This script helps you enable and test the semester-based
# academic records system in AspireAI.
#
# Usage:
#   ./setup_semester_academics.sh [command]
#
# Commands:
#   enable     - Enable the feature in .env
#   disable    - Disable the feature in .env
#   migrate    - Run migration (dry-run first, then apply)
#   test       - Test the API endpoints
#   status     - Check current status
#   help       - Show this help message
# ============================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_info "Creating .env file from example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success ".env file created"
        else
            echo "USE_SEMESTER_ACADEMICS=false" > .env
            echo "MONGODB_URI=mongodb://localhost:27017/aspireai" >> .env
            echo "PORT=5002" >> .env
            print_success ".env file created with defaults"
        fi
    fi
}

# Enable feature
enable_feature() {
    print_header "Enabling Semester Academics Feature"
    check_env_file
    
    # Check if USE_SEMESTER_ACADEMICS exists in .env
    if grep -q "USE_SEMESTER_ACADEMICS" .env; then
        # Update existing line
        sed -i '' 's/USE_SEMESTER_ACADEMICS=.*/USE_SEMESTER_ACADEMICS=true/' .env
        print_success "Feature enabled in .env file"
    else
        # Add new line
        echo "USE_SEMESTER_ACADEMICS=true" >> .env
        print_success "Feature enabled in .env file"
    fi
    
    print_info "Please restart your server for changes to take effect:"
    echo "    npm run start"
}

# Disable feature
disable_feature() {
    print_header "Disabling Semester Academics Feature"
    check_env_file
    
    if grep -q "USE_SEMESTER_ACADEMICS" .env; then
        sed -i '' 's/USE_SEMESTER_ACADEMICS=.*/USE_SEMESTER_ACADEMICS=false/' .env
        print_success "Feature disabled in .env file"
    else
        echo "USE_SEMESTER_ACADEMICS=false" >> .env
        print_success "Feature disabled in .env file"
    fi
    
    print_info "Please restart your server for changes to take effect"
}

# Run migration
run_migration() {
    print_header "Running Migration"
    
    print_info "Step 1: Dry Run (no changes will be made)"
    echo ""
    read -p "Press Enter to continue..."
    
    node scripts/migrate_academics_to_semesters.js --dry
    
    echo ""
    print_warning "Review the dry-run output above carefully!"
    echo ""
    read -p "Do you want to apply the migration? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        print_info "Step 2: Applying Migration"
        node scripts/migrate_academics_to_semesters.js --apply
        print_success "Migration completed!"
        
        print_info "You can check the migration logs in MongoDB:"
        echo "    db.migrationlogs.find()"
    else
        print_info "Migration cancelled. No changes were made."
    fi
}

# Test API endpoints
test_api() {
    print_header "Testing API Endpoints"
    
    # Check if server is running
    if ! curl -s http://localhost:5002 > /dev/null 2>&1; then
        print_error "Server is not running on port 5002"
        print_info "Start the server first: npm run start"
        exit 1
    fi
    
    print_success "Server is running"
    
    # Test feature flag endpoint
    print_info "Testing feature status..."
    response=$(curl -s http://localhost:5002/api/students/TEST123/academics)
    
    if echo "$response" | grep -q "not enabled"; then
        print_warning "Feature is not enabled yet"
        print_info "Run './setup_semester_academics.sh enable' to enable it"
    elif echo "$response" | grep -q "success"; then
        print_success "Feature is enabled and working!"
    else
        print_error "Unexpected response from server"
        echo "$response"
    fi
}

# Check status
check_status() {
    print_header "Semester Academics Status"
    
    # Check .env file
    if [ -f .env ]; then
        if grep -q "USE_SEMESTER_ACADEMICS=true" .env; then
            print_success "Feature Flag: ENABLED"
        else
            print_warning "Feature Flag: DISABLED"
        fi
    else
        print_warning ".env file not found"
    fi
    
    # Check if MongoDB is running
    if nc -z localhost 27017 2>/dev/null; then
        print_success "MongoDB: Running on localhost:27017"
    else
        print_warning "MongoDB: Not detected on localhost:27017"
    fi
    
    # Check if server is running
    if nc -z localhost 5002 2>/dev/null; then
        print_success "Backend Server: Running on port 5002"
    else
        print_warning "Backend Server: Not running on port 5002"
    fi
    
    # Check for required files
    echo ""
    print_info "Checking required files..."
    
    files=(
        "src/models/AcademicSemester.js"
        "src/schemas/academicSemester.json"
        "src/services/academicsService.js"
        "src/routes/academicsRoutes.js"
        "src/components/pages/StudentDashboard/AcademicsOverview.jsx"
        "src/components/pages/StudentDashboard/SemesterPage.jsx"
        "scripts/migrate_academics_to_semesters.js"
    )
    
    all_present=true
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Found: $file"
        else
            print_error "Missing: $file"
            all_present=false
        fi
    done
    
    echo ""
    if [ "$all_present" = true ]; then
        print_success "All required files are present!"
    else
        print_error "Some files are missing. Please check the implementation."
    fi
}

# Show help
show_help() {
    print_header "Semester Academics Setup Script"
    echo ""
    echo "Usage: ./setup_semester_academics.sh [command]"
    echo ""
    echo "Commands:"
    echo "  enable     - Enable the feature in .env"
    echo "  disable    - Disable the feature in .env"
    echo "  migrate    - Run migration (dry-run first, then apply)"
    echo "  test       - Test the API endpoints"
    echo "  status     - Check current status"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./setup_semester_academics.sh enable"
    echo "  ./setup_semester_academics.sh migrate"
    echo "  ./setup_semester_academics.sh status"
    echo ""
}

# Main script logic
case "$1" in
    enable)
        enable_feature
        ;;
    disable)
        disable_feature
        ;;
    migrate)
        run_migration
        ;;
    test)
        test_api
        ;;
    status)
        check_status
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

echo ""
print_info "For more information, see:"
echo "  - SEMESTER_ACADEMICS_README.md"
echo "  - SEMESTER_ACADEMICS_GUIDE.md"
echo "  - IMPLEMENTATION_COMPLETE.md"
