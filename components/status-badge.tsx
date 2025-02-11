interface StatusBadgeProps {
    status: boolean;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        true: "bg-green-100 text-green-700 border-green-300",
        false: " dark:text-gray-400 text-gray-700",
    }

    return (
        <span className={`px-2.5 inline-block w-16 text-center py-0.5 rounded-full text-xs font-medium border ${styles[`${status}`]}`}>
            {status ? 'Active' : 'Inactive'}
        </span>
    )
} 