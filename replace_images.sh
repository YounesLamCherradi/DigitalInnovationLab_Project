#!/bin/bash
# ============================================================
# Image Replacement Script — Digital Innovation Lab
# ============================================================
# Drop your real images in the SAME folder as this script,
# then run it. It will copy them into public/images/ and
# update all references in the source code automatically.
#
# USAGE:
#   1. Put your images next to this script (any name, any format)
#   2. Run:  bash replace_images.sh
#   3. Follow the prompts
#   4. Run:  npm run dev  to preview
#   5. Run:  npm run build:client  to rebuild for cPanel
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
IMAGES_DIR="$PROJECT_DIR/public/images"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DIL Image Replacement Script           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Check we're in the right folder
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo -e "${RED}Error: Run this script from inside the project folder (where package.json is).${NC}"
  exit 1
fi

mkdir -p "$IMAGES_DIR"

# ── Helper: pick an image file interactively ─────────────────
pick_image() {
  local slot="$1"
  local description="$2"
  local current="$3"

  echo ""
  echo -e "${YELLOW}[$slot]${NC} $description"
  echo -e "  Current: ${current}"
  echo -n "  Enter path to your image (or press Enter to skip): "
  read -r input

  if [ -z "$input" ]; then
    echo -e "  ${YELLOW}Skipped.${NC}"
    return
  fi

  # Expand ~ in path
  input="${input/#\~/$HOME}"

  if [ ! -f "$input" ]; then
    echo -e "  ${RED}File not found: $input — skipped.${NC}"
    return
  fi

  # Get extension
  ext="${input##*.}"
  ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  # Validate image extension
  if [[ ! "$ext" =~ ^(jpg|jpeg|png|webp|gif|svg)$ ]]; then
    echo -e "  ${RED}Not a supported image format (jpg/png/webp/gif/svg) — skipped.${NC}"
    return
  fi

  # New filename with correct extension
  new_name="${slot}.${ext}"
  dest="$IMAGES_DIR/$new_name"

  cp "$input" "$dest"
  echo -e "  ${GREEN}✓ Copied to public/images/$new_name${NC}"

  # Update source code references
  old_ref="/images/${slot}.svg\|/images/${slot}.jpg\|/images/${slot}.jpeg\|/images/${slot}.png\|/images/${slot}.webp\|/images/${slot}.gif"
  new_ref="/images/$new_name"

  # Update all tsx files
  find "$PROJECT_DIR/client" -name "*.tsx" | while read -r f; do
    # Replace any extension variant of this image slug
    sed -i "s|/images/${slot}\.[a-zA-Z]*|/images/$new_name|g" "$f"
  done

  echo -e "  ${GREEN}✓ Updated source code references${NC}"
}

echo -e "${BLUE}── Hero & Journey Images ──────────────────${NC}"
pick_image "hero-bg"    "Homepage hero background (large banner image)"       "hero-bg.svg"
pick_image "journey-1"  "Timeline: Digital ID Hackathon photo"                "journey-1.svg"
pick_image "journey-2"  "Timeline: ID4AFRICA 2025 Ethiopia photo"             "journey-2.svg"
pick_image "journey-3"  "Timeline: Birth of DIL photo"                        "journey-3.svg"

echo ""
echo -e "${BLUE}── Partner Logos (Welcome page) ───────────${NC}"
pick_image "partner-cmu"    "CMU Africa logo"                                 "partner-cmu.svg"
pick_image "partner-upanzi" "Upanzi Network logo"                             "partner-upanzi.svg"
pick_image "partner-wai"    "Women in AI Morocco logo"                        "partner-wai.svg"
pick_image "partner-ieee"   "IEEE WIE Morocco logo"                           "partner-ieee.svg"

echo ""
echo -e "${BLUE}── Partners Page Logos ────────────────────${NC}"
pick_image "partners-logo-1" "Partners page: logo 1"                         "partners-logo-1.svg"
pick_image "partners-logo-2" "Partners page: logo 2"                         "partners-logo-2.svg"

echo ""
echo -e "${BLUE}── Event / Gallery Photos (15 images) ─────${NC}"
echo -e "Tip: you can also just copy your photos manually to ${YELLOW}public/images/${NC}"
echo -e "and name them event-1.jpg, event-2.jpg ... event-15.jpg"
echo ""

for i in $(seq 1 15); do
  pick_image "event-$i" "Event photo $i" "event-$i.svg"
done

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Done!                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "  1. Preview:  npm run dev"
echo "  2. Rebuild for cPanel:  npm run build:client"
echo "  3. The new dist/spa folder is ready to upload to cPanel"
echo ""
