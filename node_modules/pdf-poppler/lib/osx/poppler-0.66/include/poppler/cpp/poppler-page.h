/*
 * Copyright (C) 2009-2010, Pino Toscano <pino@kde.org>
 * Copyright (C) 2018, Suzuki Toshiya <mpsuzuki@hiroshima-u.ac.jp>
 * Copyright (C) 2018, Albert Astals Cid <aacid@kde.org>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street - Fifth Floor, Boston, MA 02110-1301, USA.
 */

#ifndef POPPLER_PAGE_H
#define POPPLER_PAGE_H

#include "poppler-global.h"
#include "poppler-rectangle.h"

#include <memory>

namespace poppler
{

struct text_box_data;
class POPPLER_CPP_EXPORT text_box
{
    friend class page;
public:
    text_box(text_box&&) = default;
    text_box& operator=(text_box&&) = default;

    ~text_box();

    ustring   text() const;
    rectf     bbox() const;

    /**
       Get a bbox for the i-th glyph

       This method returns a rectf of the bounding box for
       the i-th glyph in the text_box.

       \note The text_box object owns the rectf objects,
       the caller is not needed to free them.

       \warning For too large glyph index, rectf(0,0,0,0)
       is returned. The number of the glyphs and ustring
       codepoints might be different in some complex scripts.
     */
    rectf     char_bbox(size_t i) const;
    bool      has_space_after() const;
private:
    text_box(text_box_data *data);

    std::unique_ptr<text_box_data> m_data;
};

class document;
class document_private;
class page_private;
class page_transition;

class POPPLER_CPP_EXPORT page : public poppler::noncopyable
{
public:
    enum orientation_enum {
        landscape,
        portrait,
        seascape,
        upside_down
    };
    enum search_direction_enum {
        search_from_top,
        search_next_result,
        search_previous_result
    };
    enum text_layout_enum {
        physical_layout,
        raw_order_layout
    };

    ~page();

    orientation_enum orientation() const;
    double duration() const;
    rectf page_rect(page_box_enum box = crop_box) const;
    ustring label() const;

    page_transition* transition() const;

    bool search(const ustring &text, rectf &r, search_direction_enum direction,
                case_sensitivity_enum case_sensitivity, rotation_enum rotation = rotate_0) const;
    ustring text(const rectf &rect = rectf()) const;
    ustring text(const rectf &rect, text_layout_enum layout_mode) const;

    /**
       Returns a list of text of the page

       This method returns a std::vector of text_box that contain all
       the text of the page, with roughly one text word of text
       per text_box item.

       For text written in western languages (left-to-right and
       up-to-down), the std::vector contains the text in the proper
       order.

       \since 0.63

       \note The page object owns the text_box objects as unique_ptr,
             the caller is not needed to free them.

       \warning This method is not tested with Asian scripts
    */
    std::vector<text_box> text_list() const;

private:
    page(document_private *doc, int index);

    page_private *d;
    friend class page_private;
    friend class document;
};

}

#endif
