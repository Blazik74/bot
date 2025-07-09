import os
import re

def remove_comment_lines_inplace(filepath, comment_prefix=None, html_block_comments=False, c_style_block_comments=False, json_mode=False):
    with open(filepath, 'r', encoding='utf-8') as infile:
        lines = infile.readlines()
    new_lines = []
    in_html_comment = False
    in_c_block_comment = False
    for line in lines:
        stripped = line.lstrip()
        if html_block_comments:
            if not in_html_comment and '<!--' in line:
                in_html_comment = True
                if '-->' in line:
                    in_html_comment = False
                continue
            if in_html_comment:
                if '-->' in line:
                    in_html_comment = False
                continue
            if stripped.startswith('//'):
                continue
            new_lines.append(line)
        elif c_style_block_comments:
            if not in_c_block_comment and '/*' in line:
                in_c_block_comment = True
                if '*/' in line:
                    in_c_block_comment = False
                continue
            if in_c_block_comment:
                if '*/' in line:
                    in_c_block_comment = False
                continue
            if stripped.startswith('//'):
                continue
            new_lines.append(line)
        elif json_mode:
            if stripped.startswith('//') or stripped.startswith('#'):
                continue
            new_lines.append(line)
        else:
            if comment_prefix and stripped.startswith(comment_prefix):
                continue
            new_lines.append(line)
    with open(filepath, 'w', encoding='utf-8') as outfile:
        outfile.writelines(new_lines)

def process_all_files():
    script_name = os.path.basename(__file__)
    script_path = os.path.abspath(__file__)
    for root, dirs, files in os.walk('.'):
        for filename in files:
            filepath = os.path.join(root, filename)
            if os.path.abspath(filepath) == script_path:
                continue
            if filename.endswith('.py'):
                remove_comment_lines_inplace(filepath, comment_prefix='#')
                print(f'Processed {filepath}')
            elif filename.endswith('.html'):
                remove_comment_lines_inplace(filepath, comment_prefix='//', html_block_comments=True)
                print(f'Processed {filepath}')
            elif filename.endswith('.js') or filename.endswith('.css'):
                remove_comment_lines_inplace(filepath, comment_prefix='//', c_style_block_comments=True)
                print(f'Processed {filepath}')
            elif filename.endswith('.json'):
                remove_comment_lines_inplace(filepath, json_mode=True)
                print(f'Processed {filepath}')

if __name__ == "__main__":
    process_all_files() 