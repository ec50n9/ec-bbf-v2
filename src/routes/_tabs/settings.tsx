import Header from "@/components/share/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { resetDatabase } from "@/services/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // 模拟的设置数据
  const settings = [
    {
      id: 1,
      title: "自动备份",
      description: "每天自动备份数据库",
      enabled: true,
    },
    {
      id: 2,
      title: "深色模式",
      description: "切换深色/浅色主题",
      enabled: false,
    },
    {
      id: 3,
      title: "消息通知",
      description: "启用系统通知提醒",
      enabled: true,
    },
  ];

  const handleResetDatabase = async () => {
    try {
      await resetDatabase();
      setIsResetDialogOpen(false);
      toast.success("数据库已重置成功");
    } catch (error) {
      console.error("重置数据库失败:", error);
      toast.error("重置数据库失败，请重试");
    }
  };

  return (
    <div>
      <Header title="设置" />
      <div className="mt-3 mr-4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div>
                    <div className="font-medium">{setting.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {setting.description}
                    </div>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">危险操作区</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">重置数据库</div>
                <div className="text-sm text-muted-foreground">
                  清空所有数据并重新初始化数据库，此操作不可恢复
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsResetDialogOpen(true)}
              >
                重置数据库
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认重置数据库？</DialogTitle>
              <DialogDescription>
                此操作将清空所有数据并重新初始化数据库。此操作不可恢复，请谨慎操作。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
              >
                取消
              </Button>
              <Button variant="destructive" onClick={handleResetDatabase}>
                确认重置
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
