import React from 'react';
import UserInformation from './user-analytics/UserInformation';
import { Card, CardContent } from '@/components/ui';
import FoodChart from './user-analytics/FoodChart';
import FoodOrderChart from './user-analytics/FoodOrderChart';

const UserDashboard = ({ userId }: { userId: string }) => {
    return (
        <div className="space-y-6 p-4">
            <UserInformation userId={userId} />
            <Card className="shadow-sm">
                <CardContent>
                    <br />
                    <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FoodChart />
                        <FoodOrderChart />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDashboard;