branch_name=$(git rev-parse --abbrev-ref HEAD)

if [[ $branch_name == "main" ]] || [[ $branch_name == dev/* ]] ; then
    echo "✅ - Build can proceed"
    exit 1
else
    echo "🛑 - Build cancelled"
    exit 0
fi
