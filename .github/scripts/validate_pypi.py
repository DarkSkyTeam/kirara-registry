import json
import sys
import requests
import os

def check_package(package_name):
    response = requests.get(f"https://pypi.org/pypi/{package_name}/json")
    return response.status_code == 200

def create_comment_body(results):
    # 检查是否所有检查都通过
    all_passed = all(
        result.get('status', '').startswith('✅') 
        for result in results
    )
    
    # 添加状态标题
    if all_passed:
        comment = "## ✅ Registry 验证通过\n\n"
        comment += "所有检查项目均已通过，可以继续合并。\n\n"
    else:
        comment = "## ❌ Registry 验证失败\n\n"
        comment += "⚠️ **此 Pull Request 暂时无法合并**\n\n"
        comment += "请修复以下问题后重新提交：\n"
        comment += "- 确保所有 JSON 文件格式正确\n"
        comment += "- 确保所有 PyPI 包名填写正确且包已发布\n"
        comment += "- 确保所有必需字段都已填写\n\n"
    
    comment += "### 详细检查结果\n\n"
    comment += "| 名称 | 描述 | 作者 | PyPI 包名 | 检测结果 |\n"
    comment += "|------|------|------|-----------|----------|\n"
    
    for result in results:
        name = result.get('name', 'N/A')
        description = result.get('description', 'N/A')
        author = result.get('author', 'N/A')
        pypi_package = result.get('pypiPackage', 'N/A')
        status = result.get('status', '❌ 未知错误')
        
        # Escape pipe characters in markdown table
        name = name.replace('|', '\\|')
        description = description.replace('|', '\\|')
        author = author.replace('|', '\\|')
        
        # 为 PyPI 包名添加链接
        if pypi_package != 'N/A':
            pypi_package = f"[{pypi_package}](https://pypi.org/project/{pypi_package}/)"
        
        comment += f"| {name} | {description} | {author} | {pypi_package} | {status} |\n"
    
    return comment

def main():
    if 'PR_WORKSPACE' not in os.environ:
        print("错误：未设置 PR_WORKSPACE 环境变量")
        sys.exit(1)

    pr_workspace = os.environ['PR_WORKSPACE']
    exit_code = 0
    results = []
    
    for file_path in os.environ['CHANGED_FILES'].split():
        if not file_path.startswith('registry/') or not file_path.endswith('.json'):
            continue
            
        # 使用 PR 工作区的文件路径
        pr_file_path = os.path.join(pr_workspace, file_path)
        print(f"Checking {pr_file_path}...")
        result = {}
        
        try:
            with open(pr_file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # 复制基本信息
            for field in ['name', 'description', 'author', 'pypiPackage']:
                if field in data:
                    result[field] = data[field]
                
            if 'pypiPackage' not in data:
                result['status'] = '⚠️ 缺少 PyPI 包名'
                print(f"Warning: {file_path} does not contain pypiPackage field")
                exit_code = 1
            else:
                package_name = data['pypiPackage']
                if check_package(package_name):
                    result['status'] = '✅ PyPI 包存在'
                    print(f"Package {package_name} exists on PyPI")
                else:
                    result['status'] = '❌ PyPI 包不存在'
                    print(f"Error: Package {package_name} not found on PyPI")
                    exit_code = 1
                    
        except json.JSONDecodeError as e:
            result['status'] = f'❌ JSON 格式错误: {str(e)}'
            print(f"Error: Invalid JSON in {file_path}: {str(e)}")
            exit_code = 1
        except Exception as e:
            result['status'] = f'❌ 处理出错: {str(e)}'
            print(f"Error processing {file_path}: {str(e)}")
            exit_code = 1
            
        results.append(result)
    
    # 生成评论内容并保存到文件
    if results:
        comment_body = create_comment_body(results)
        with open('validation_comment.txt', 'w', encoding='utf-8') as f:
            f.write(comment_body)
    
    sys.exit(exit_code)

if __name__ == '__main__':
    main()